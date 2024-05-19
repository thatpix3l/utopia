#!/bin/env php
<?php

$argv = $_SERVER['argv'];

function separator(): string
{
    if (PHP_OS_FAMILY === 'Windows') {
        return "\\";
    }

    return "/";
}

function join_paths(string ...$paths): string
{

    $path = preg_replace('#/+#', '/', join(separator(), $paths));
    if (is_array($path) || $path === null) {
        return "";
    }

    return $path;

}

function to_unix_path(string $path)
{

    if (PHP_OS_FAMILY !== "Windows") {
        return $path;
    }

    $path = str_replace('\\', '/', $path);
    if (is_array($path)) {
        return "";
    }

    $path = preg_replace('|(?<=.)/+|', '/', $path);
    if (is_array($path) || $path === null) {
        return "";
    }

    if (':' === substr($path, 1, 1)) {
        $drive_letter = ucfirst(substr($path, 0, 1));
        $without_drive_letter = substr($path, 3);
        $path = $drive_letter . "/" . $without_drive_letter;
    }

    return $path;
}

function using_podman_vm(): bool
{
    return PHP_OS_FAMILY === "Windows" || PHP_OS_FAMILY === "Darwin";
}

function native_podman_home(): string
{
    if (!using_podman_vm()) {
        return getenv("HOME");
    }

    $output = [];
    exec("podman machine ssh pwd", $output);

    return $output[0];
}

function podman_accessible_host_path(string $path)
{
    if (PHP_OS_FAMILY != 'Windows' && PHP_OS_FAMILY != 'Darwin') {
        return $path;
    }

    return "/mnt/" . lcfirst(to_unix_path($path));
}

function native_podman_cmd(array $cmd)
{
    if (PHP_OS_FAMILY !== "Windows" && PHP_OS_FAMILY !== "Darwin") {
        return $cmd;
    }

    return array_merge(["podman", "machine", "ssh"], $cmd);
}

function is_drive_root(string $path): bool
{
    $after_drive_letter = substr($path, 2);

    return $after_drive_letter === "" || $after_drive_letter === "/";

}

function get_repo_path(): string
{

    $item_anchor = ".git";

    $path = join_paths(getcwd(), $item_anchor);
    for (; !file_exists($path); ) {
        $parent = dirname(dirname($path));

        if ($parent === "/" || is_drive_root($parent)) {
            return "";
        }

        $path = join_paths($parent, $item_anchor);

    }

    $path = dirname($path);

    echo $path . "\n";

    return $path;
}

$repo_path = get_repo_path();

function to_action(...$cmd): callable
{

    $cmd = native_podman_cmd($cmd);

    return function () use ($cmd) {

        $descriptor_spec = array (
            0 => array ("pipe", "r"),
            1 => array ("pipe", "w"),
            2 => array ("pipe", "w"),
        );

        $process = proc_open($cmd, $descriptor_spec, $pipes);

        if (is_resource($process)) {
            fclose($pipes[0]);

            $proc_out = stream_get_contents($pipes[1]);
            fclose($pipes[1]);

            $proc_err = stream_get_contents($pipes[2]);
            fclose($pipes[2]);

            proc_close($process);

            echo $proc_out;
            echo $proc_err;


        }

    };
}

function exec_ssh(string $cmd)
{
}

$mysql_data_path = escapeshellarg(podman_accessible_host_path(join_paths(native_podman_home(), "utopia-mysql-data.tar")));

$database_actions = array(
    'stop' => to_action('systemctl', '--user', 'stop', 'utopia-mysql'),
    'restart' => to_action('systemctl', '--user', 'restart', 'utopia-mysql'),
    'delete' => to_action('podman', 'volume', 'rm', 'utopia-mysql-data'),
    'backup' => to_action('podman', 'volume', 'export', 'utopia-mysql-data', '--output', $mysql_data_path),
    'restore' => to_action('podman', 'volume', 'import', 'utopia-mysql-data', $mysql_data_path),
);

$php_actions = array(
    'stop' => to_action('systemctl', '--user', 'stop', 'utopia-php'),
    'restart' => to_action('systemctl', '--user', 'restart', 'utopia-php'),
);

function test()
{
    for ($i = 0; $i < 5; $i++) {
        echo "test\n";
    }
}

function multi_cmd(...$actions)
{
    return function () use ($actions) {
        foreach ($actions as $action) {
            $action();
        }
    };
}


$all_actions = array(
    "restart" => multi_cmd($php_actions["stop"], $database_actions["restart"], $php_actions["restart"])
);


function host_home(): string
{
    return $_SERVER['HOME'] ?? (/*windows compatibility: */ $_SERVER['HOMEDRIVE'] . $_SERVER['HOMEPATH']);
}

$repo_quadlet_dir = escapeshellarg(podman_accessible_host_path(join_paths($repo_path, "quadlets")));
$native_podman_containers_dir = escapeshellarg(to_unix_path(join_paths(native_podman_home(), ".config", "containers")));
$native_podman_systemd_dir = escapeshellarg(to_unix_path(join_paths(native_podman_home(), ".config", "containers", "systemd")));

$create_local_dir = to_action('mkdir', '-p', $native_podman_containers_dir);
$link_dir = multi_cmd(
    to_action('ln', '-s', $repo_quadlet_dir, $native_podman_systemd_dir),
    to_action('ln', '-s', $repo_quadlet_dir, $native_podman_systemd_dir),
);

$systemd = [
    'link' => multi_cmd($create_local_dir, $link_dir),
    'reload' => to_action('systemctl', '--user', 'daemon-reload')

];

$cmds = array(
    "database" => $database_actions,
    "api" => $php_actions,
    "all" => $all_actions,
    "systemd" => $systemd
);

function whitespace(int $count)
{
    $count_str = strval($count);
    return sprintf("%" . $count_str . "s", "");
}

$show_cmd = function (string $subcmd, int $level) {
    echo sprintf(" %s", $subcmd);
};

$err_unsupported = function ($subcmd, int $level) {
    echo "ERROR: unsupported item in subcommand, exiting early...\n";
};

$show_key = function (array $subcmd, string $key, int $level) {
    echo sprintf("\n%s%s:", whitespace($level * 4), $key);
};

interface TreeEvents
{
    function before_walk(array $value);
    function before_descent(string $key, array $value, int $level);
    function item(string $key, $value, int $level);
    function after_descent(string $key, array $value, int $level);
    function after_walk(array $value);
}

class Tree
{
    public TreeEvents $events;
    public array $storage = [];
    public function __construct(TreeEvents $events)
    {
        $this->events = $events;
    }
    private function walk_recur(string $key, $value, int $level)
    {

        $this->events->item($key, $value, $level);

        if (!is_array($value)) {
            return;
        }


        $this->events->before_descent($key, $value, $level);

        foreach ($value as $subkey => $subvalue) {
            $this->walk_recur($subkey, $subvalue, $level + 1);
        }

        $this->events->after_descent($key, $value, $level);

    }

    public function walk()
    {
        if ($this->events === null) {
            return;
        }

        $this->events->before_walk($this->storage);
        $this->walk_recur("", $this->storage, -1);
        $this->events->after_walk($this->storage);
    }

}

class ShowAvailable implements TreeEvents
{
    function before_walk(array $value)
    {
        echo "available subcommands:\n";
    }
    function before_descent(string $key, array $values, int $level)
    {
    }

    function item($key, $value, $level)
    {

        if ($key === "") {
            return;
        }

        printf("%s%s", whitespace($level * 4), $key);

        if (!is_callable($value)) {
            printf(":");
        }

        printf("\n");
    }

    function after_descent(string $key, $value, int $level)
    {
    }

    function after_walk(array $value)
    {
    }

}

class RunSubcommand implements TreeEvents
{
    public string $search;
    public bool $found = false;
    function before_walk(array $value)
    {
    }
    function before_descent(string $key, array $values, int $level)
    {
    }

    function item($key, $value, $level)
    {

        if ($key !== $this->search) {
            return;
        }

        $this->found = true;
        $value();

    }

    function after_descent(string $key, $value, int $level)
    {
    }

    function after_walk(array $value)
    {
    }
}

function main()
{

    global $argv, $cmds;

    $show_available = new Tree(new ShowAvailable());
    $show_available->storage = $cmds;

    $run_subcommands = new RunSubcommand();

    $value = $cmds;
    for ($i = 1; $i < count($argv); $i++) {

        $key = $argv[$i];

        $value = $value[$key] ?? null;

        if ($value === null) {
            echo sprintf("subcommand \"%s\" does not exist\n", $key);
            $show_available->walk();
            return;
        }

        if ($i === count($argv) - 1) {

            if (is_callable($value)) {
                $value();
            }

        }

    }

}

main();
