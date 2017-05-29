const Integrations = require('../src/models/Integrations')
const Configs = require('../src/models/Configs')
const HomeLinks = require('../src/models/HomeLinks')
const User = require('../src/models/User')

module.exports = async function () {
  let integrationsCount = await Integrations.count()
  let configsCount = await Configs.count()
  let usersCount = await User.count()
  let homeLinksCount = await HomeLinks.count()

  if (integrationsCount === 0 && configsCount === 0 && usersCount === 0 && homeLinksCount === 0) {
    log.info('Polulating sample data...')

    await User.saveUser({ username: 'admin', password: 'admin', displayName: 'Administrator' })

    await new Integrations({
      name: 'jenkins-example',
      displayName: 'Jenkins Example',
      rootUrl: 'http://localhost:8080',
      processUrlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/{{processId}}', // processId - is job build number in jenkins context
      auth: {
        'pass': 'admin',
        'user': 'admin'
      },
      actions: { // action support urlTemplate, method and body
        // JOB_NAME variable is defined in config integration props
        run: {
          'urlTemplate': '{{rootUrl}}/job/{{JOB_NAME}}/build',
          'method': 'POST'
        },
        runWithParams: {
          'urlTemplate': '{{rootUrl}}/job/{{JOB_NAME}}/buildWithParameters',
          'method': 'POST'
        },
        disable: {
          'urlTemplate': '{{rootUrl}}/job/{{JOB_NAME}}/disable',
          'method': 'POST'
        },
        enable: {
          'urlTemplate': '{{rootUrl}}/job/{{JOB_NAME}}/enable',
          'method': 'POST'
        },
        cancel: {
          'urlTemplate': '{{rootUrl}}/job/{{JOB_NAME}}/{{processId}}/stop',
          'method': 'POST'
        }
      }
    }).save()

    await new Configs({
      name: 'Example Config #1',
      type: 'Clean',
      hostname: 'localhost',
      osNameExt: 'Centos 7.3',
      isNix: true,
      dbName: 'mysql',
      dbVersion: '5.7',
      dbHostname: 'db-host.com',
      links: {
        'Job': '{{rootUrl}}/job/{{JOB_NAME}}',
        'Tomcat': 'http://{{hostname}}:{{TOMCAT_PORT}}'
      },
      integration: {
        props: { // props can be used in integration actions and links
          'JOB_NAME': 'jnks-job1',
          'TOMCAT_PORT': '8080'
        },
        name: 'jenkins-example'
      }
    }).save()
    await new Configs({
      name: 'Example Config #2',
      type: 'Upgrade',
      hostname: 'localhost',
      osNameExt: 'Windows 2016',
      isNix: false,
      dbName: 'MSSQL',
      dbVersion: '2016',
      dbHostname: 'db-host.com',
      links: {
        'Job': '{{rootUrl}}/job/{{JOB_NAME}}',
        'IIS': 'http://{{hostname}}:{{IIS_PORT}}'
      },
      integration: {
        props: { // props can be used in integration actions and links
          'JOB_NAME': 'jnks-job2',
          'IIS_PORT': '80'
        },
        name: 'jenkins-example'
      }
    }).save()

    await new HomeLinks({
      name: 'Youtube',
      link: 'https://youtube.com',
      details: 'Watch funny videos and relax :)',
      group: 'non work related'
    }).save()

    log.info('Done!')
  }
}
