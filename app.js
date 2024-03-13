const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/modify', upload.single('file'), (req, res) => {
    const operation = req.body.operation;
    let modifiedCsv;

    switch (operation) {
        case 'addStateColumn':
            modifiedCsv = addStateColumn(req.file.path);
            break;
        case 'goodStatesKept':
            modifiedCsv = goodStatesKept(req.file.path);
            break;
        case 'badStatesRemoved':
            modifiedCsv = badStatesRemoved(req.file.path);
            break;
        default:
            modifiedCsv = 'Invalid operation';
    }

    // Set response headers to trigger file download
    res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="modified.csv"'
    });

    // Send the modified CSV content as the response
    res.send(modifiedCsv);
});

function addStateColumn(filePath) {
    // Add state column modification code here
    return 'Modified CSV for addStateColumn operation';
}

function goodStatesKept(filePath) {
    // Good states kept modification code here
    return 'Modified CSV for goodStatesKept operation';
}

function badStatesRemoved(filePath) {
    // Bad states removed modification code here
    return 'Modified CSV for badStatesRemoved operation';
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
