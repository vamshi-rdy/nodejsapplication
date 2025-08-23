To add Jenkins credentials to the checkout (or git) step in a Declarative Pipeline, you should use the credentialsId parameter with the git step.

Here's how to update your Checkout stage to use Jenkins credentials (e.g., for private Git repositories that require authentication):

pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/vamshi-rdy/complete-code.git'
        MAVEN_HOME = tool name: 'Maven 3', type: 'maven'
        IMAGE_NAME = 'your-app-name'
        ECR_REGISTRY = '253603915156.dkr.ecr.ap-south-1.amazonaws.com'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: 'your-jenkins-credentials-id', 
                    url: "${GITHUB_REPO}"
            }
        }

        // Other stages...
    }
}

🔐 How to Set Up the credentialsId in Jenkins:

Go to Jenkins Dashboard > Manage Jenkins > Credentials.

Choose a domain (or global).

Click Add Credentials.

Choose the type:

Username with password (for HTTPS Git)

SSH Username with private key (for SSH Git)

Set an ID (e.g., github-credentials).

Use that ID in your pipeline as credentialsId: 'github-credentials'.

# Example with SSH Git URL (if you use SSH instead of HTTPS):
git url: 'git@github.com:vamshi-rdy/complete-code.git',
    branch: 'main',
    credentialsId: 'your-ssh-key-credentials-id'

🔐 How to Set Up github-https-creds in Jenkins:

Follow these steps to create the credentials used in the credentialsId:

Go to Jenkins Dashboard → Manage Jenkins → Credentials.

Choose (global) or a specific domain.

Click Add Credentials.

Select "Username with password" as the credential type.

Fill in:

Username: Your GitHub username or email.

Password: A GitHub Personal Access Token (PAT)
 (recommended instead of your actual password).

Set ID to something like: github-https-creds

Click Save.

✅ Why Use a Personal Access Token (PAT)?

GitHub removed password authentication for HTTPS. You must use a PAT in place of your password when accessing repos over HTTPS from Jenkins or scripts.

To generate a PAT:

Visit https://github.com/settings/tokens

Click "Generate new token (classic)"

Select scopes like repo, read:org, etc., depending on your access needs.

Once the credentials are saved, your Checkout stage will authenticate securely using them.
