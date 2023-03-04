pipeline {
   agent any

   tools {nodejs "nodejs"}

   stages {

      stage('Copy config file') {
         steps {
           configFileProvider([configFile(fileId: 'a583a0ef-78c7-40d2-8d84-8aa5219f3428', targetLocation: '.env')]) {
               load ".env";
           }
         }
      }
      stage('npm install modules') {
         steps {
           echo "Install modules..."
           sh "npm install --production=true"
           echo "Install modules - Completed!"
         }
      }
      stage('Copy env') {
         steps {
           echo "Copy env..."
           sh "pwd"
           sh "ls -la"
           echo "Install modules - Completed!"
         }
      }
      stage('Migration project') {
         steps {
            echo "Migration project..."
            sh "node ace migration:run --force"
            echo "Migration project - Completed!"
         }
      }
      stage('Build project') {
         steps {
            echo "Build project..."
            sh "npm run build"
            echo "Build project - Completed!"
         }
      }
      stage ('Deploy') {
        steps {
            echo "Copy build folder for develop..."
            sh 'ssh gitlab-runner@something rm -rf /var/www/temp_deploy/develop'
            sh 'ssh gitlab-runner@something mkdir -p /var/www/temp_deploy/develop/'
            sh 'scp -r build gitlab-runner@something:/var/www/temp_deploy/develop/'
            sh 'ssh gitlab-runner@something "ls -la /var/www/temp_deploy/develop"'
            sh 'ssh gitlab-runner@something "ls -la /var/www/temp_deploy/develop/build"'


            sh 'ssh gitlab-runner@something "rm -rf /var/www/develop && mkdir -p /var/www/develop/ && mv /var/www/temp_deploy/develop/build /var/www/develop/build"'
            echo "Copy build folder - Completed!"


            echo "Copy env file ..."
            sh 'ssh gitlab-runner@something "cp /var/www/.develop.env /var/www/develop/build/.env"'
            echo "Copy env file - Completed!"
            sh 'ssh gitlab-runner@something "ls -la /var/www/develop && ls -la /var/www/develop/build"'

            sh 'ssh gitlab-runner@something "cd /var/www/develop/build && pwd && ls -la && npm ci --production"'
            echo "Launching app with sycning service..."
            sh 'scp ecosystem.config.js gitlab-runner@something:/var/www/develop/ecosystem.config.js'
            sh 'ssh gitlab-runner@something "cd /var/www/develop && pm2 startOrReload ecosystem.config.js"'
        }
      }
   }
}


