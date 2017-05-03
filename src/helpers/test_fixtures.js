/**
 * Example TemplateInstances
 */
const droppedElements = [
 {
   "id": "age_range",
   "name": "Age Range",
   "category": "Demographics",
   "parameters": [
     {
       "id": "element_name",
       "type": "string",
       "name": "Element Name",
       "value": "name1"
     },
     {
       "id": "min_age",
       "type": "integer",
       "name": "Minimum Age",
       "value": 30
     },
     {
       "id": "max_age",
       "type": "integer",
       "name": "Maximum Age",
       "value": 45
     }
   ],
   "uniqueId": "age_range31"
 },
 {
   "id": "most_recent_observation",
   "name": "Most Recent Observation",
   "category": "Observations",
   "parameters": [
     {
       "id": "element_name",
       "type": "string",
       "name": "Element Name",
       "value": "name2"
     },
     {
       "id": "observation",
       "type": "observation",
       "name": "Observation",
       "value": {
         "id": "ldl_cholesterol",
         "name": "LDL Cholesterol",
         "oid": "2.16.840.1.113883.3.464.1003.198.12.1016",
         "units": {
           "values": [
             "mg/dL"
           ],
           "code": "mg/dL"
         }
       }
     }
   ],
   "uniqueId": "most_recent_observation67"
 }
];

export {
  droppedElements
};
