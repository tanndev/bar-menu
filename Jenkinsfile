#!/usr/bin/env groovy

pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.Jenkins-agent'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v /etc/passwd:/etc/passwd -v /var/lib/jenkins:/var/lib/jenkins'
        }
    }

    stages {

        stage('Build') {
            steps {
                echo 'Building...'
                // Build the image.
                script {
                    image = docker.build("jftanner/bar-menu")
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
                // TODO Actually test something
            }
        }

        stage('Release') {
            when {
                branch 'master'
            }
            steps {

                // Run Semantic release
                script {
                    credentials = [
                            string(credentialsId: 'github-personal-access-token', variable: 'GITHUB_TOKEN'),
                            string(credentialsId: 'npm-token', variable: 'NPM_TOKEN'),
                            usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')
                    ]
                }
                withCredentials(credentials) {
                    sh 'npx semantic-release'
                }
                script {
                    RELEASE_VERSION = sh (
                            script: "git tag --points-at",
                            returnStdout: true
                    ).trim()
                    RELEASE_URL = 'https://github.com/Tanndev/bar-menu/releases/tag/' + RELEASE_VERSION
                    echo "Version: ${RELEASE_VERSION} can be viewed at ${RELEASE_URL}"

                    // Set build information
                    currentBuild.displayName = RELEASE_VERSION
                    currentBuild.description = RELEASE_URL
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                script {
                    sshagent(['jenkins.ssh']) {
                        sh 'ssh docker.tanndev.com rm -rf bar-menu'
                        sh 'ssh docker.tanndev.com mkdir bar-menu'
                        sh 'scp docker-compose.yml docker.tanndev.com:bar-menu/'
                        sh 'ssh docker.tanndev.com "cd bar-menu && docker-compose pull"'
                        sh 'ssh docker.tanndev.com "cd bar-menu && docker-compose up -d"'
                    }

                    if (RELEASE_VERSION) {
                        slackSend channel: '#general', color: 'good', message: "Released <https://bar-menu.tanndev.com|Bar Menu> ${RELEASE_VERSION}. (<${RELEASE_URL}|Release Notes>) (<${env.BUILD_URL}console|Build Console>)"
                    }
                    else {
                        slackSend channel: '#general', color: 'good', message: "Redeployed <https://bar-menu.tanndev.com|Bar Menu>. (<${env.BUILD_URL}console|Build Console>)"
                    }
                }
            }
        }
    }

    post {
        failure {
            slackSend channel: '#general', color: 'danger', message: "Failed to build/publish Bar Menu. (<${env.JOB_URL}|Pipeline>) (<${env.BUILD_URL}console|Build Console>)"
        }
    }
}
