const express = require('express');
const axios = require('axios');
const router = express.Router();
const SG_API = process.env.SG_API;

router.post('/mailing-list', function (req, res, next) {
    let content = req.body;
    let email = content['email'];
    axios.put('https://api.sendgrid.com/v3/marketing/contacts', {
        contacts: [
            {
                email: email
            }
        ]
    }, {
        headers: {
            'authorization': 'Bearer ' + SG_API,
            'Content-Type': 'application/json'
        }
    }).then(data => {
        res.status(200).send(data.data)
    }).catch(error => {
        console.log(error);
        res.status(500).send(error)
    })
});

router.post('/contact-form', function (req, res, next) {
    const formData = req.body;
    console.log(formData);
    if (!formData.name || !formData.email || !formData.message) {
        res.status(402).send('Missing form field!');
    } else {
        axios.all([
            axios.post('https://api.sendgrid.com/v3/mail/send', {
                "personalizations": [
                    {
                        "to": [
                            {
                                "email": formData.email,
                                "name": formData.name
                            }
                        ],
                        "dynamic_template_data": {
                            "email": formData.email,
                            "name": formData.name,
                            "message": formData.message
                        },
                        "subject": "VMSS60 - Contact Request Received"
                    }
                ],
                "from": {
                    "email": "noreply@vmss60.com",
                    "name": "VMSS60"
                },
                "reply_to": {
                    "email": process.env.DEST_EMAIL,
                    "name": process.env.DEST_NAME
                },
                "template_id": "d-46025b41a73143dbaf82d797c8612b81"
            }, {
                headers: {
                    'authorization': 'Bearer ' + SG_API,
                    'Content-Type': 'application/json'
                }
            }),
            axios.post('https://api.sendgrid.com/v3/mail/send', {
                "personalizations": [
                    {
                        "to": [
                            {
                                "email": process.env.DEST_EMAIL,
                                "name": process.env.DEST_NAME
                            }
                        ],
                        "dynamic_template_data": {
                            "email": formData.email,
                            "name": formData.name,
                            "message": formData.message
                        },
                        "subject": "VMSS60 - Contact Request Received"
                    }
                ],
                "from": {
                    "email": "noreply@vmss60.com",
                    "name": "VMSS60"
                },
                "reply_to": {
                    "email": process.env.DEST_EMAIL,
                    "name": process.env.DEST_NAME
                },
                "template_id": "d-81bbca1dc9274d0eb34eb47ec35e22d2"
            }, {
                headers: {
                    'authorization': 'Bearer ' + SG_API,
                    'Content-Type': 'application/json'
                }
            })
        ]).then(axios.spread((a, b) => {
            console.log(a.data);
            console.log(b.data);
            res.status(200).send('yay??')
        })).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    }
});

module.exports = router;