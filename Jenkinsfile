pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/necilcakmak/Blog.Ui.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('.') {
                    sh 'docker build -t blog_ui_image .'
                }
            }
        }

        stage('Run (or Restart) Container') {
            steps {
                script {
                    // Eğer container varsa durdur ve sil
                    sh '''
                    if [ $(docker ps -aq -f name=ui_container) ]; then
                        docker rm -f ui_container
                    fi
                    '''
                    // Yeni container'ı çalıştır
                    sh '''
                    docker run -d \
                      --name ui_container \
                      -p 3000:3000 \
                      -e NODE_ENV=production \
                      -e NEXT_PUBLIC_API_URL=http://localhost:44322/api \
                      -e API_URL_INTERNAL=http://localhost:44322/api \
                      blog_ui_image
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'UI container başarıyla başlatıldı!'
        }
        failure {
            echo 'Pipeline başarısız oldu!'
        }
    }
}
