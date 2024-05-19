UPDATE utopia.user
SET username = ?,
    password_hash = ?
WHERE id = ?;