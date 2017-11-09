// Import Dependencies
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const fs = require('fs');
const uuid = require('uuid/v1');
const path = require('path');

const app = express();

let artifacts = {};

const artifactsDir = process.env.ARTIFACTS_DIR || 'artifacts';

if (!fs.existsSync(artifactsDir)){
    fs.mkdirSync(artifactsDir);
}

// This is where Acquia seems to run
const port = process.env.API_PORT || 8083;
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/artifacts', express.static(artifactsDir))

// Setting headers to Prevent Errors from Cross Origin Resource Sharing
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  // Remove caching for most recent authors
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Starts Server
if(!module.parent) { // check if within a test or not.
  app.listen(port, function() {
    console.log(`api running on port ${port}`);
  });
};

app.get('/rest/session/token', (req, res) => {
  res.send('123456789abcdef');
});

app.get('/rest/views/artifacts', (req, res) => {
  res.json(
      [
        {
            "title": "<a href=\"/cds/artifact/statin-use-primary-prevention-cvd-adults\" hreflang=\"en\">Statin Use for the Primary Prevention of CVD in Adults</a>",
            "nid": "18",
            "uuid": "0f9f07fe-c5cf-4282-b567-38747b25b816",
            "field_version": `${(artifacts[18]||{}).version||'0.0'}`
        }
    ]
  );
});

app.get('/node/:id', (req, res) => {
  res.json({
        "_links": {
            "self": {
                "href": "http://localhost:8083/cds/artifact/statin-use-primary-prevention-cvd-adults?_format=hal_json"
            },
            "type": {
                "href": "http://localhost:8083/rest/type/node/artifact"
            },
            "http://localhost:8083/rest/relation/node/artifact/uid": [
                {
                    "href": "http://localhost:8083/user/1?_format=hal_json",
                    "lang": "en"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/revision_uid": [
                {
                    "href": "http://localhost:8083/user/1?_format=hal_json"
                }
            ],
            "d": [
                {
                    "href": ""
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_implementation_details": [
                {
                    "href": ""
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_keywords": [
                {
                    "href": "http://localhost:8083/keywords/ascvd?_format=hal_json"
                },
                {
                    "href": "http://localhost:8083/keywords/cvd?_format=hal_json"
                },
                {
                    "href": "http://localhost:8083/keywords/cholesterol?_format=hal_json"
                },
                {
                    "href": "http://localhost:8083/keywords/10-year-ascvd-risk?_format=hal_json"
                },
                {
                    "href": "http://localhost:8083/keywords/risk-assessment?_format=hal_json"
                },
                {
                    "href": "http://localhost:8083/keywords/preventive-screening?_format=hal_json"
                },
                {
                    "href": "http://localhost:8083/keywords/statin-therapy?_format=hal_json"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_publisher": [
                {
                    "href": "http://localhost:8083/cds/org/mitre-corporation?_format=hal_json"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_purpose_and_usage": [
                {
                    "href": ""
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_repository_information": [
                {
                    "href": ""
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_supporting_evidence": [
                {
                    "href": ""
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_testing_experience": [
                {
                    "href": ""
                }
            ]
        },
        "nid": [
            {
                "value": 18
            }
        ],
        "uuid": [
            {
                "value": "0f9f07fe-c5cf-4282-b567-38747b25b816"
            }
        ],
        "vid": [
            {
                "value": 49
            }
        ],
        "langcode": [
            {
                "value": "en",
                "lang": "en"
            }
        ],
        "type": [
            {
                "target_id": "artifact"
            }
        ],
        "status": [
            {
                "value": true,
                "lang": "en"
            }
        ],
        "title": [
            {
                "value": "Statin Use for the Primary Prevention of CVD in Adults",
                "lang": "en"
            }
        ],
        "_embedded": {
            "http://localhost:8083/rest/relation/node/artifact/uid": [
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/user/1?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/user/user"
                        }
                    },
                    "uuid": [
                        {
                            "value": "b360995d-1745-439c-a2a7-35f5ea300a15"
                        }
                    ],
                    "lang": "en"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/revision_uid": [
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/user/1?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/user/user"
                        }
                    },
                    "uuid": [
                        {
                            "value": "b360995d-1745-439c-a2a7-35f5ea300a15"
                        }
                    ]
                }
            ],
            "d": [
                {
                    "_links": {
                        "self": {
                            "href": ""
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/paragraph/artifact_representation"
                        }
                    },
                    "uuid": [
                        {
                            "value": "e6836f99-a19b-41d1-84b5-710f7208bd3b"
                        }
                    ],
                    "target_revision_id": "17"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_implementation_details": [
                {
                    "_links": {
                        "self": {
                            "href": ""
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/paragraph/implementation_details"
                        }
                    },
                    "uuid": [
                        {
                            "value": "557c3938-c23b-4301-9308-323d0667fbfe"
                        }
                    ],
                    "target_revision_id": "18"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_keywords": [
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/ascvd?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "6085d107-0df9-45e1-9d6e-ccbaaa0b001d"
                        }
                    ]
                },
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/cvd?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "a050854c-7dd0-4734-98ab-3740e9644574"
                        }
                    ]
                },
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/cholesterol?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "2b430c44-3967-43c9-8514-a55d7a719e6a"
                        }
                    ]
                },
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/10-year-ascvd-risk?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "961184aa-2a8e-4c85-951f-2181a6a76bca"
                        }
                    ]
                },
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/risk-assessment?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "832b4e83-ee5d-4839-a24e-a789db59f7d3"
                        }
                    ]
                },
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/preventive-screening?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "f0376598-9962-4421-b774-d35d4acb557c"
                        }
                    ]
                },
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/keywords/statin-therapy?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/taxonomy_term/keywords"
                        }
                    },
                    "uuid": [
                        {
                            "value": "d8c2e83b-9ae8-4b12-be8f-d385be8a6a6b"
                        }
                    ]
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_publisher": [
                {
                    "_links": {
                        "self": {
                            "href": "http://localhost:8083/cds/org/mitre-corporation?_format=hal_json"
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/node/organization"
                        }
                    },
                    "uuid": [
                        {
                            "value": "25631887-9b0f-4ee4-b28f-577844a30e72"
                        }
                    ]
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_purpose_and_usage": [
                {
                    "_links": {
                        "self": {
                            "href": ""
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/paragraph/purpose_and_usage"
                        }
                    },
                    "uuid": [
                        {
                            "value": "99b68d22-052b-4342-8108-4c16434746e9"
                        }
                    ],
                    "target_revision_id": "19"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_repository_information": [
                {
                    "_links": {
                        "self": {
                            "href": ""
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/paragraph/repository_information"
                        }
                    },
                    "uuid": [
                        {
                            "value": "8338a1ef-f482-4a80-bd6c-9acf1c00ef28"
                        }
                    ],
                    "target_revision_id": "20"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_supporting_evidence": [
                {
                    "_links": {
                        "self": {
                            "href": ""
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/paragraph/supporting_evidence"
                        }
                    },
                    "uuid": [
                        {
                            "value": "0b44ba7d-5eb7-4007-931d-2d95ee23a4a1"
                        }
                    ],
                    "target_revision_id": "23"
                }
            ],
            "http://localhost:8083/rest/relation/node/artifact/field_testing_experience": [
                {
                    "_links": {
                        "self": {
                            "href": ""
                        },
                        "type": {
                            "href": "http://localhost:8083/rest/type/paragraph/testing_experience"
                        }
                    },
                    "uuid": [
                        {
                            "value": "1a209b0e-5e0a-406e-a75b-29b1f034fe47"
                        }
                    ],
                    "target_revision_id": "24"
                }
            ]
        },
        "created": [
            {
                "value": 1497985383,
                "lang": "en"
            }
        ],
        "changed": [
            {
                "value": 1498012807,
                "lang": "en"
            }
        ],
        "promote": [
            {
                "value": false,
                "lang": "en"
            }
        ],
        "sticky": [
            {
                "value": false,
                "lang": "en"
            }
        ],
        "revision_timestamp": [
            {
                "value": 1498012807
            }
        ],
        "revision_translation_affected": [
            {
                "value": true,
                "lang": "en"
            }
        ],
        "default_langcode": [
            {
                "value": true,
                "lang": "en"
            }
        ],
        "path": [
            {
                "alias": "/cds/artifact/statin-use-primary-prevention-cvd-adults",
                "pid": 336,
                "lang": "en"
            }
        ],
        "moderation_state": [
            {
                "target_id": "published",
                "lang": "en"
            }
        ],
        "field_copyrights": [
            {
                "value": "<p>Recommendation is copyrighted by USPTF. Additional rights are TBD.</p>\r\n",
                "format": "rich_text"
            }
        ],
        "field_description": [
            {
                "value": "<p>Presents a United States Preventive Services Task Force (USPSTF) statin therapy recommendation for adults aged 40 to 75 years without a history of cardiovascular disease (CVD) who have 1 or more CVD risk factors (i.e., dyslipidemia, diabetes, hypertension, or smoking) and a calculated 10-year CVD event risk score of 7.5% or greater.</p>\r\n",
                "format": "rich_text",
                "lang": "en"
            }
        ],
        "field_experimental": [
            {
                "value": true
            }
        ],
        "field_identifier": [
            {
                "value": "CDS 009",
                "lang": "en"
            }
        ],
        "field_ip_attestation": [
            {
                "value": false
            }
        ],
        "field_version": [
            {
                "value": "0.1.0"
            }
        ]
    })
});

app.post('/jsonapi/file/zip', (req, res) => {
  data = '';
  req.on('data', (chunk) => {
    data+=chunk;
  });
  req.on('end', () => {
      let file = JSON.parse(data);
      let buffer = Buffer.from(file.data.attributes.data, 'base64');
      let outputName = `artifacts/${uuid()}.zip`;
      let out = fs.writeFileSync(outputName, buffer);
      res.send(outputName)
      res.end();
  });

})

app.patch('/node/:nid', (req, res) => {
  artifacts[req.params.nid] = {path: req.body.path, version: req.body.version, updated: new Date()};
  res.send(`/node/${req.params.nid}/artifacts`);
});

app.get('/node/:nid/artifacts', (req, res) => {
  let artifact = artifacts[req.params.nid]
  if(artifact) {
    res.send(artifact);
    return;
  }
  res.sendStatus(404);

});

app.get('/node/', (req, res) => {
  res.send(artifacts);
})
