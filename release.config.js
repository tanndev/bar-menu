const COMMIT_ANALYZER = '@semantic-release/commit-analyzer';

const RELEASE_NOTES_GENERATOR = '@semantic-release/release-notes-generator';

const NPM = '@semantic-release/npm';

const GITHUB = [
    '@semantic-release/github',
    {
        successComment: "This ${issue.pull_request ? 'pull request is included' : 'issue is fixed'} in version ${nextRelease.version}",
        failTitle: 'CI: The automatic release failed',
        labels: ['release pipeline']
    }
];

const DOCKER = [
    'semantic-release-docker',
    {name: 'jftanner/bar-menu'}
];

module.exports = {
    branch: 'master',
    repositoryUrl: 'git@github.com:Tanndev/bar-menu.git',
    plugins: [
        COMMIT_ANALYZER,
        RELEASE_NOTES_GENERATOR,
        NPM,
        GITHUB,
        DOCKER
    ]
};
