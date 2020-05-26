# web-app

The Next.js app + Kubernetes templates

For Map visualization, the dataset is used is
`VIC_Govt_CSA-UoM_AURIN_DB_csa_family_violence_family_incident_rate_lga_jul2013_jun2018`
which is stored in a CouchDB database named `domestic_violence_vic`

For Tweet visualization, the tweets are stored in a CouchDB database named `twitter_data`

Ensure CouchDB databases are set up beforehand for proper execution.
See:\
https://github.com/cloud-71/twitter-harvester \
https://github.com/cloud-71/aurin-harvester

Setup environment with:
 
    npm install

and run with:
 
    npm run dev
