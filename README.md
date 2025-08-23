1) To add Jenkins credentials to the checkout (or git) step in a Declarative Pipeline, you should use the credentialsId parameter with the git step.

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

2)The error you're seeing:

/var/lib/jenkins/workspace/poc-pipeline@tmp/durable-293294f4/script.sh.copy: 1: npm: not found
means that npm (Node.js) is not installed or not available in the PATH on the Jenkins agent that ran the pipeline.

✅ Solution Options
🔧 Option 1: Install Node.js on the Jenkins Agent

Ensure that Node.js (which includes npm) is installed on the machine/agent that runs the job.

On Ubuntu/Debian, you can install it like this:
sudo apt update
sudo apt install nodejs npm -y

Or for a more up-to-date version:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

Then confirm:
  node -v
  npm -v

🔁 Option 2: Use Jenkins Tool Configuration

If you want better control, configure Node.js as a tool in Jenkins:

Go to Manage Jenkins → Global Tool Configuration.

Find NodeJS section (install NodeJS Plugin
 if it's missing).

Click Add NodeJS.

Give it a name (e.g., Node 18), select a version, and check “Install automatically.”

Save.

Then update your pipeline to use the tool:

pipeline {
    agent any
    tools {
        nodejs 'Node 18'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-https-creds', 
                    url: 'https://github.com/vamshi-rdy/complete-code.git'
            }
        }

        stage('Install & Lint') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }
    }
}
✅ Option 3: Use a Docker Agent with Node Preinstalled

If your Jenkins server supports Docker, you can use a Docker image with Node.js:

pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root' // Optional: use root user
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-https-creds', 
                    url: 'https://github.com/vamshi-rdy/complete-code.git'
            }
        }

        stage('Install & Lint') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }
    }
}
This is clean, portable, and doesn't depend on what's installed on the Jenkins host.
✅ Recommendation

If you're just testing and want quick results, go with Option 3 (Docker agent).

If you're setting up for long-term use, configure Node.js as a Jenkins tool (Option 2).

## b) Great question — understanding the difference between npm ci and npm install is important for reliable and efficient builds, especially in CI/CD environments like Jenkins.
   ⚖️ npm install vs npm ci — Key Differences


   | Feature                            | `npm install`                                         | `npm ci`                                        |
| ---------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| **Purpose**                        | General-purpose dependency installation               | Clean, fast, and reproducible install for CI    |
| **Requires `package-lock.json`?**  | No (but uses it if present)                           | ✅ Yes (must exist and be valid)                 |
| **Modifies `package-lock.json`?**  | ✅ Yes — can update it if package versions are updated | ❌ No — strictly follows it                      |
| **Installs missing dependencies?** | ✅ Yes                                                 | ✅ Yes, but only as defined in the lock file     |
| **Removes extra modules?**         | ❌ No                                                  | ✅ Yes — clears `node_modules` before installing |
| **Speed**                          | Slower, especially on cold installs                   | ⚡ Faster and consistent                         |
| **Use Case**                       | Local development                                     | CI/CD pipelines or production builds            |

🔍 In Detail
🔹 npm install

Installs dependencies listed in package.json.

Will generate or update package-lock.json.

If versions are defined loosely (e.g., ^1.0.0), different installs may yield different results.

Good for development, when you want flexibility.

🔹 npm ci ("clean install")

Stands for Continuous Integration.

Completely removes the node_modules folder.

Uses only package-lock.json to install exact versions — ensuring full reproducibility.

Fails if:

package-lock.json is missing

It doesn’t match package.json

✅ When to Use
Scenario	Command
Local development	npm install
Jenkins / CI / Docker builds	npm ci
Ensuring reproducible builds	npm ci
Quickly installing exact deps	npm ci

# 🔐 Summary

Use npm install when you’re developing.
Use npm ci when you’re deploying or testing in CI, where you want fast, deterministic installs.
