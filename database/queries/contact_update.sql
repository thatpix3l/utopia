UPDATE utopia.contact
SET name_first = ?,
    name_last = ?,
    phone = ?,
    email = ?
WHERE id = ?
    AND user_id = ?;