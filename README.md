Prerequiste:
===================================
Salesforce API user & password with security token
AWS S3 bucket (e.g. aadatabucket***), bucket name has to be unique

Option 1 - Just use the stack as is
===================================
Follow the blog
https://medium.com/p/74cbebc49d2a/edit

Option 2 - Modify the stack and deploy
======================================
sam validate -t ./template.yaml

make deploy YOUR_EMAIL=REPLACE_THIS_WITH_ADMIN_EMAIL STACK_NAME=aafunctions STACK_BUCKET=REPLACE_THIS_WITH_S3_CODEBUCKET COPYBUCKET=COPYBUCKET  SFDCUSERNAME=REPLACE_THIS_WITH_SFDC_USERNAME SFDCPASSWORD=REPLACE_THIS_WITH_SFDCPASSWORD SFDCURL="https://login.salesforce.com"

e.g.
make deploy YOUR_EMAIL=someone@gomeone.somedomainname STACK_NAME=aafunctions STACK_BUCKET=kamicodebucket COPYBUCKET="aadatabucket/rawdaily"  SFDCUSERNAME="api@pbo.somedomainorg" SFDCPASSWORD="passwordwithsecuritytoken" SFDCURL="https://login.salesforce.com"
