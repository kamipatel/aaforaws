# Set defaults if the Env vars aren't set
ifeq ($(YOUR_EMAIL),)
YOUR_EMAIL := ''
endif

ifeq ($(STACK_NAME),)
STACK_NAME := ''
endif

ifeq ($(STACK_BUCKET),)
STACK_BUCKET := ''
endif

ifeq ($(COPYBUCKET),)
COPYBUCKET := ''
endif

ifeq ($(SFDCUSERNAME),)
SFDCUSERNAME := ''
endif

ifeq ($(SFDCPASSWORD),)
SFDCPASSWORD := ''
endif

ifeq ($(SFDCURL),)
SFDCURL := ''
endif

ifeq ($(DailyBatchPayload),)
DailyBatchPayload := '{}'
endif


.AA: deploy
deploy:
	aws cloudformation package \
		--template-file template.yaml \
		--output-template template_deploy.yaml \
		--s3-bucket $(STACK_BUCKET)

	# aws s3 cp ./swagger.yaml s3://$(STACK_BUCKET)/lambda-cognito-go-api-def.yaml
	aws cloudformation deploy \
		--no-fail-on-empty-changeset \
		--capabilities CAPABILITY_IAM \
		--template-file template_deploy.yaml \
		--stack-name $(STACK_NAME) \
		--parameter-overrides "ResourceBucket=$(STACK_BUCKET)" "NotificationEmail=$(YOUR_EMAIL)" "CopyBucket=$(COPYBUCKET)" "SfdcUserName=$(SFDCUSERNAME)" "SfdcPassword=$(SFDCPASSWORD)" "SfdcURL=$(SFDCURL)" 

.AA: teardown
teardown:
	aws cloudformation delete-stack --stack-name $(STACK_NAME)
