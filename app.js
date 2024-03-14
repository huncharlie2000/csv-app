const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// Sample area code to state mapping
const areaCodeToState = {
    '201': 'NJ',
    '202': 'DC',
    '203': 'CT',
    '204': 'MB',
    '205': 'AL',
    '206': 'WA',
    '207': 'ME',
    '208': 'ID',
    '209': 'CA',
    '210': 'TX',
    '211': '--',
    '212': 'NY',
    '213': 'CA',
    '214': 'TX',
    '215': 'PA',
    '216': 'OH',
    '217': 'IL',
    '218': 'MN',
    '219': 'IN',
    '220': 'OH',
    '223': 'PA',
    '224': 'IL',
    '225': 'LA',
    '226': 'ON',
    '228': 'MS',
    '229': 'GA',
    '231': 'MI',
    '234': 'OH',
    '236': 'BC',
    '239': 'FL',
    '240': 'MD',
    '242': '--',
    '246': '--',
    '248': 'MI',
    '250': 'BC',
    '251': 'AL',
    '252': 'NC',
    '253': 'WA',
    '254': 'TX',
    '256': 'AL',
    '260': 'IN',
    '262': 'WI',
    '264': '--',
    '267': 'PA',
    '268': '--',
    '269': 'MI',
    '270': 'KY',
    '272': 'PA',
    '276': 'VA',
    '278': 'MI',
    '281': 'TX',
    '283': 'OH',
    '284': '--',
    '289': 'ON',
    '301': 'MD',
    '302': 'DE',
    '303': 'CO',
    '304': 'WV',
    '305': 'FL',
    '306': 'SK',
    '307': 'WY',
    '308': 'NE',
    '309': 'IL',
    '310': 'CA',
    '311': '--',
    '312': 'IL',
    '313': 'MI',
    '314': 'MO',
    '315': 'NY',
    '316': 'KS',
    '317': 'IN',
    '318': 'LA',
    '319': 'IA',
    '320': 'MN',
    '321': 'FL',
    '323': 'CA',
    '325': 'TX',
    '330': 'OH',
    '331': 'IL',
    '332': 'NY',
    '334': 'AL',
    '336': 'NC',
    '337': 'LA',
    '339': 'MA',
    '340': 'VI',
    '341': 'CA',
    '343': 'ON',
    '345': '--',
    '346': 'TX',
    '347': 'NY',
    '351': 'MA',
    '352': 'FL',
    '360': 'WA',
    '361': 'TX',
    '365': 'ON',
    '369': 'CA',
    '380': 'OH',
    '385': 'UT',
    '386': 'FL',
    '401': 'RI',
    '402': 'NE',
    '403': 'AB',
    '404': 'GA',
    '405': 'OK',
    '406': 'MT',
    '407': 'FL',
    '408': 'CA',
    '409': 'TX',
    '410': 'MD',
    '411': '--',
    '412': 'PA',
    '413': 'MA',
    '414': 'WI',
    '415': 'CA',
    '416': 'ON',
    '417': 'MO',
    '418': 'QC',
    '419': 'OH',
    '423': 'TN',
    '424': 'CA',
    '425': 'WA',
    '430': 'TX',
    '431': 'MB',
    '432': 'TX',
    '434': 'VA',
    '435': 'UT',
    '437': 'ON',
    '438': 'QC',
    '440': 'OH',
    '441': '--',
    '442': 'CA',
    '443': 'MD',
    '450': 'QC',
    '456': '--',
    '458': 'OR',
    '464': 'IL',
    '469': 'TX',
    '470': 'GA',
    '473': '--',
    '475': 'CT',
    '478': 'GA',
    '479': 'AR',
    '480': 'AZ',
    '481': 'QC',
    '484': 'PA',
    '500': '--',
    '501': 'AR',
    '502': 'KY',
    '503': 'OR',
    '504': 'LA',
    '505': 'NM',
    '506': 'NB',
    '507': 'MN',
    '508': 'MA',
    '509': 'WA',
    '510': 'CA',
    '511': '--',
    '512': 'TX',
    '513': 'OH',
    '514': 'QC',
    '515': 'IA',
    '516': 'NY',
    '517': 'MI',
    '518': 'NY',
    '519': 'ON',
    '520': 'AZ',
    '530': 'CA',
    '539': 'OK',
    '540': 'VA',
    '541': 'OR',
    '548': 'ON',
    '551': 'NJ',
    '555': '--',
    '557': 'MO',
    '559': 'CA',
    '561': 'FL',
    '562': 'CA',
    '563': 'IA',
    '564': 'WA',
    '567': 'OH',
    '570': 'PA',
    '571': 'VA',
    '573': 'MO',
    '574': 'IN',
    '575': 'NM',
    '579': 'QC',
    '580': 'OK',
    '581': 'QC',
    '585': 'NY',
    '586': 'MI',
    '587': 'AB',
    '600': '--',
    '601': 'MS',
    '602': 'AZ',
    '603': 'NH',
    '604': 'BC',
    '605': 'SD',
    '606': 'KY',
    '607': 'NY',
    '608': 'WI',
    '609': 'NJ',
    '610': 'PA',
    '611': '--',
    '612': 'MN',
    '613': 'ON',
    '614': 'OH',
    '615': 'TN',
    '616': 'MI',
    '617': 'MA',
    '618': 'IL',
    '619': 'CA',
    '620': 'KS',
    '623': 'AZ',
    '626': 'CA',
    '627': 'CA',
    '628': 'CA',
    '629': 'TN',
    '630': 'IL',
    '631': 'NY',
    '636': 'MO',
    '639': 'SK',
    '641': 'IA',
    '646': 'NY',
    '647': 'ON',
    '649': '--',
    '650': 'CA',
    '651': 'MN',
    '657': 'CA',
    '660': 'MO',
    '661': 'CA',
    '662': 'MS',
    '664': '--',
    '667': 'MD',
    '669': 'CA',
    '670': 'MP',
    '671': 'GU',
    '678': 'GA',
    '679': 'MI',
    '681': 'WV',
    '682': 'TX',
    '684': '--',
    '689': 'FL',
    '700': '--',
    '701': 'ND',
    '702': 'NV',
    '703': 'VA',
    '704': 'NC',
    '705': 'ON',
    '706': 'GA',
    '707': 'CA',
    '708': 'IL',
    '709': 'NL',
    '710': '--',
    '711': '--',
    '712': 'IA',
    '713': 'TX',
    '714': 'CA',
    '715': 'WI',
    '716': 'NY',
    '717': 'PA',
    '718': 'NY',
    '719': 'CO',
    '720': 'CO',
    '721': '--',
    '724': 'PA',
    '725': 'NV',
    '727': 'FL',
    '731': 'TN',
    '732': 'NJ',
    '734': 'MI',
    '737': 'TX',
    '740': 'OH',
    '743': 'NC',
    '747': 'CA',
    '754': 'FL',
    '757': 'VA',
    '758': '--',
    '760': 'CA',
    '762': 'GA',
    '763': 'MN',
    '764': 'CA',
    '765': 'IN',
    '767': '--',
    '769': 'MS',
    '770': 'GA',
    '772': 'FL',
    '773': 'IL',
    '774': 'MA',
    '775': 'NV',
    '778': 'BC',
    '779': 'IL',
    '780': 'AB',
    '781': 'MA',
    '782': 'NS',
    '784': '--',
    '785': 'KS',
    '786': 'FL',
    '787': 'PR',
    '800': '--',
    '801': 'UT',
    '802': 'VT',
    '803': 'SC',
    '804': 'VA',
    '805': 'CA',
    '806': 'TX',
    '807': 'ON',
    '808': 'HI',
    '809': '--',
    '810': 'MI',
    '811': '--',
    '812': 'IN',
    '813': 'FL',
    '814': 'PA',
    '815': 'IL',
    '816': 'MO',
    '817': 'TX',
    '818': 'CA',
    '819': 'QC',
    '822': '--',
    '825': 'AB',
    '828': 'NC',
    '829': '--',
    '830': 'TX',
    '831': 'CA',
    '832': 'TX',
    '833': '--',
    '835': 'PA',
    '843': 'SC',
    '844': '--',
    '845': 'NY',
    '847': 'IL',
    '848': 'NJ',
    '849': '--',
    '850': 'FL',
    '855': '--',
    '856': 'NJ',
    '857': 'MA',
    '858': 'CA',
    '859': 'KY',
    '860': 'CT',
    '862': 'NJ',
    '863': 'FL',
    '864': 'SC',
    '865': 'TN',
    '866': '--',
    '867': 'YT',
    '868': '--',
    '869': '--',
    '870': 'AR',
    '872': 'IL',
    '873': 'QC',
    '876': '--',
    '877': '--',
    '878': 'PA',
    '880': '--',
    '881': '--',
    '882': '--',
    '888': '--',
    '898': '--',
    '900': '--',
    '901': 'TN',
    '902': 'NS',
    '903': 'TX',
    '904': 'FL',
    '905': 'ON',
    '906': 'MI',
    '907': 'AK',
    '908': 'NJ',
    '909': 'CA',
    '910': 'NC',
    '911': '--',
    '912': 'GA',
    '913': 'KS',
    '914': 'NY',
    '915': 'TX',
    '916': 'CA',
    '917': 'NY',
    '918': 'OK',
    '919': 'NC',
    '920': 'WI',
    '925': 'CA',
    '927': 'FL',
    '928': 'AZ',
    '929': 'NY',
    '931': 'TN',
    '935': 'CA',
    '936': 'TX',
    '937': 'OH',
    '939': 'PR',
    '940': 'TX',
    '941': 'FL',
    '947': 'MI',
    '949': 'CA',
    '951': 'CA',
    '952': 'MN',
    '954': 'FL',
    '956': 'TX',
    '957': 'NM',
    '959': 'CT',
    '970': 'CO',
    '971': 'OR',
    '972': 'TX',
    '973': 'NJ',
    '975': 'MO',
    '976': '--',
    '978': 'MA',
    '979': 'TX',
    '980': 'NC',
    '984': 'NC',
    '985': 'LA',
    '989': 'MI',
    '999': '--',
};


// Function to modify state based on phone numbers
function modifyState(results) {
  results.forEach((row) => {
    const phoneNumber = row.PhoneNumber
    const areaCode = phoneNumber.substring(0, 3); // Extract area code
    row.State = areaCodeToState[areaCode] || ''; // Lookup state based on area code
  });
}

  
// Function to capitalize first letter of each word in FirstName column
function capitalizeNames(results) {
  results.forEach((row) => {
    row.FirstName = row.FirstName.replace(/\b\w/g, char => char.toUpperCase());
  });
}


app.post('/upload', upload.single('csvfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const operation = req.body.operation;
  
  if (!operation) {
    return res.status(400).send('No operation specified.');
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Perform the selected operation on the data
      switch (operation) {
        case 'modifyState':
          modifyState(results);
          break;
        case 'capitalizeNames':
          capitalizeNames(results);
          break;
        default:
          return res.status(400).send('Invalid operation.');
      }

      // Write the modified data to a new CSV file
      const csvWriter = createObjectCsvWriter({
        path: 'modified.csv',
        header: Object.keys(results[0]) // Assuming all rows have the same structure
      });

      csvWriter.writeRecords(results)
        .then(() => {
            // Send the modified CSV file as a download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=modified.csv');
            
            // Write the headers as the first line of the response
            res.write(Object.keys(results[0]).join(',') + '\n');
            
            // Write the modified CSV data
            results.forEach(row => {
            res.write(Object.values(row).join(',') + '\n');
            });

            res.end();

            // Delete the uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) {
                console.error('Error deleting file:', err);
                } else {
                console.log('Uploaded file deleted.');
                }
            });
            
            console.log('CSV file successfully modified and sent.');
        })
        .catch((err) => {
            console.error('Error writing CSV:', err);
            res.status(500).send('Error modifying CSV.');
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log(`Visit http://localhost:3000/ in your browser`);
});
