@echo off
setlocal

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Create .mvn\wrapper directory if not exists
if not exist ".mvn\wrapper" mkdir ".mvn\wrapper"

REM Download maven-wrapper.jar if not exists
if not exist ".mvn\wrapper\maven-wrapper.jar" (
    echo Downloading Maven Wrapper...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper.jar', '.mvn\wrapper\maven-wrapper.jar')"
)

REM Run Maven
call mvnw.cmd spring-boot:run

endlocal
