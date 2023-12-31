const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "sql302.infinityfree.com",
    user: "if0_35700049",
    password: "511SpurFtK",
    database: "if0_35700049_member"
})

app.get("/", (req, res) => {
    const sql = "Select * from members";
    db.query(sql, (err, data) => {
        if (err) console.log(err);
        return res.json(data);
    })

})

app.get("/read/:id", (req, res) => {
    const memberId = req.params.id;
    const sql = "Select * from members where id= ?";
    db.query(sql, memberId, (err, data) => {
        if (err) console.log(err);
        return res.json(data);
    })

})

app.post('/post', (req, res) => {
    const { code, name, mobile } = req.body;

    db.query('INSERT INTO members (code, name, mobile) VALUES (?, ?, ?)', [code, name, mobile], (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Member code already exists. Please use a different code.' });
            } else {
                return res.status(500).json({ error: 'Error adding data' });
            }
        } else {
            res.json({ message: 'Data added successfully' });
        }
    });
});

app.put('/edit/:id', (req, res) => {
    const memberId = req.params.id;
    const { code, name, mobile } = req.body;

    db.query('UPDATE members SET `code` = ?, `name` = ?, `mobile` = ? WHERE id = ?', [code, name, mobile, memberId], (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Member code already exists. Please use a different code.' });
            } else {
                return res.status(500).json({ error: 'Error adding data' });
            }
        } else {
            res.json({ message: 'Data updated successfully' });
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const memberId = req.params.id;

    db.query('DELETE FROM members WHERE id = ?', memberId, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting data' });
        } else {
            res.json({ message: 'Data deleted successfully' });
        }
    });
});


app.listen(5000, () => {
    console.log("SERVER IS RUNNING ON PORT 5000...");
});
