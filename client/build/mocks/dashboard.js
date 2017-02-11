[{
  "name": "a1-clean",
  "package": "9.1125",
  "isFailure": false,
  "isValid": true,
  "isRunning": false,
  "startTime": 1485880296315,
  "processUrl": "http://stl-dev-srapl:8080/serena_ra/app#/application-process-request/a5b6d1b1-4ea2-46ce-bc42-e2c3aef29882/log",
  "test": {
    "timestamp": 1485870968890,
    "restState": "passed"
  },
  "env": {
    "type": "Clean",
    "dbName": "MSSQL",
    "dbVersion": "2008 R2 SP1",
    "osNameExt": "Server 2008 R2",
    "isNix": false,
    "duration": 36000000
  }}, {
  "name": "a1-upgrade-major",
  "package": "9.1125",
  "isFailure": true,
  "isValid": true,
  "isRunning": false,
  "startTime": 1485880296315,
  "processUrl": "http://stl-dev-srapl:8080/serena_ra/app#/application-process-request/a5b6d1b1-4ea2-46ce-bc42-e2c3aef29882/log",
  "test": {
    "timestamp": 1485870968890,
    "restState": "passed",
    "uiState": "failed"
  },
  "env": {
    "type": "Upgrade major",
    "dbName": "MSSQL",
    "dbVersion": "2008 R2 SP1",
    "osNameExt": "Server 2008 R2",
    "isNix": false,
    "duration": 36000000,
    "browser": "firefox"
  }}, {
  "name": "rh6-clean",
  "package": "9.1125",
  "isFailure": false,
  "isValid": true,
  "isRunning": true,
  "startTime": 1485880296315,
  "processUrl": "http://stl-dev-srapl:8080/serena_ra/app#/application-process-request/a5b6d1b1-4ea2-46ce-bc42-e2c3aef29882/log",
  "test": {
    "timestamp": 1485870968890,
    "restState": "running"
  },
  "env": {
    "type": "Clean",
    "dbName": "MSSQL",
    "dbVersion": "2008 R2 SP1",
    "osNameExt": "Server 2008 R2",
    "isNix": true,
    "duration": 36000000
  }}, {
  "name": "a2-clean",
  "package": "9.1124",
  "isFailure": false,
  "isValid": false,
  "isRunning": false,
  "startTime": 1485880296315,
  "processUrl": "http://stl-dev-srapl:8080/serena_ra/app#/application-process-request/a5b6d1b1-4ea2-46ce-bc42-e2c3aef29882/log",
  "test": { },
  "env": {
    "type": "Clean",
    "dbName": "MSSQL",
    "dbVersion": "2008 R2 SP1",
    "osNameExt": "Server 2008 R2",
    "isNix": false,
    "duration": 36000000
  }}, {
  "name": "a3-upgrade-minor",
  "package": "9.1125",
  "isFailure": false,
  "isValid": true,
  "isRunning": true,
  "startTime": 1485880296315,
  "processUrl": "http://stl-dev-srapl:8080/serena_ra/app#/application-process-request/a5b6d1b1-4ea2-46ce-bc42-e2c3aef29882/log",
  "test": { },
  "env": {
    "type": "Upgrade minor",
    "dbName": "MSSQL",
    "dbVersion": "2008 R2 SP1",
    "osNameExt": "Server 2008 R2",
    "isNix": false,
    "duration": 36000000
  }}
]