import { IntegrationsModel } from '../models/Integrations.js'
import { ConfigsModel } from '../models/Configs.js'
import { HomeLinksModel } from '../models/HomeLinks.js'
import { UserModel } from '../models/User.js'
import { SettingsModel } from '../models/Settings.js'
import { AppVersionModel } from '../models/AppVersion.js'

const createAdminUser = async () => UserModel.register({ username: 'admin', displayName: 'Administrator' }, 'admin')

export const prepopulate = async () => {
  const integrationsCount = await IntegrationsModel.count()
  const configsCount = await ConfigsModel.count()
  const usersCount = await UserModel.count()
  const homeLinksCount = await HomeLinksModel.count()

  if (integrationsCount === 0 && configsCount === 0 && usersCount === 0 && homeLinksCount === 0) {
    console.log('Polulating sample data...')

    const timestamp = new Date().getTime()

    await new AppVersionModel({ major: 3, minor: 0 }).save()

    await new SettingsModel({ name: 'signup_allowed', flag: true, timestamp: timestamp }).save()

    await createAdminUser()

    await new IntegrationsModel({
      name: 'jenkins-example',
      displayName: 'Jenkins Example',
      rootUrl: 'http://localhost:8080',
      processUrlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/{{processId}}', // processId - is job build number in jenkins context
      auth: {
        pass: 'admin',
        user: 'admin',
      },
      actions: {
        // action support urlTemplate, method and body
        // JOB_NAME variable is defined in config integration props
        run: {
          urlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/build',
          method: 'POST',
        },
        runWithParams: {
          urlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/buildWithParameters',
          method: 'POST',
        },
        disable: {
          urlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/disable',
          method: 'POST',
        },
        enable: {
          urlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/enable',
          method: 'POST',
        },
        cancel: {
          urlTemplate: '{{rootUrl}}/job/{{JOB_NAME}}/{{processId}}/stop',
          method: 'POST',
        },
      },
      timestamp: timestamp,
    }).save()

    await new ConfigsModel({
      name: 'Example Config #1',
      type: 'Clean',
      hostname: 'localhost',
      osNameExt: 'Centos 7.3',
      isNix: true,
      dbName: 'mysql',
      dbVersion: '5.7',
      dbHostname: 'db-host.com',
      links: {
        Job: '{{rootUrl}}/job/{{JOB_NAME}}',
        Tomcat: 'http://{{hostname}}:{{TOMCAT_PORT}}',
      },
      integration: {
        props: {
          // props can be used in integration actions and links
          JOB_NAME: 'jnks-job1',
          TOMCAT_PORT: '8080',
        },
        name: 'jenkins-example',
      },
      timestamp: timestamp,
    }).save()
    await new ConfigsModel({
      name: 'Example Config #2',
      type: 'Upgrade',
      hostname: 'localhost',
      osNameExt: 'Windows 2016',
      isNix: false,
      dbName: 'MSSQL',
      dbVersion: '2016',
      dbHostname: 'db-host.com',
      links: {
        Job: '{{rootUrl}}/job/{{JOB_NAME}}',
        IIS: 'http://{{hostname}}:{{IIS_PORT}}',
      },
      integration: {
        props: {
          // props can be used in integration actions and links
          JOB_NAME: 'jnks-job2',
          IIS_PORT: '80',
        },
        name: 'jenkins-example',
      },
      timestamp: timestamp,
    }).save()

    await new HomeLinksModel({
      name: 'Youtube',
      link: 'https://youtube.com',
      details: 'Watch funny videos and relax :)',
      group: 'non work related',
      timestamp: timestamp,
    }).save()

    console.log('Done!')
  }
}

export const upgradeDb = async () => {
  const versionsCount = await AppVersionModel.count()

  // upgrade from v2
  if (versionsCount === 0) {
    console.log('Upgrading db from v2 to v3...')
    console.log('All users will be deleted. Please use admin/admin to login.')

    await AppVersionModel.remove({})
    await createAdminUser()

    console.log('Done!')
  }
}
