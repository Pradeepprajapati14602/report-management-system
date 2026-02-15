# Download Maven Wrapper JAR
$wrapperDir = ".mvn\wrapper"
$jarFile = "$wrapperDir\maven-wrapper.jar"

# Create directory if not exists
if (!(Test-Path $wrapperDir)) {
    New-Item -ItemType Directory -Force -Path $wrapperDir | Out-Null
}

# Try different URLs for the wrapper jar
$urls = @(
    "https://repo1.maven.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper.jar",
    "https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper.jar",
    "https://github.com/takari/maven-wrapper/raw/master/maven-wrapper.jar"
)

$downloaded = $false
foreach ($url in $urls) {
    try {
        Write-Host "Trying: $url"
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $jarFile)

        # Check if file is valid (should be larger than 1KB)
        $fileInfo = Get-Item $jarFile
        if ($fileInfo.Length -gt 1024) {
            Write-Host "Successfully downloaded maven-wrapper.jar ($($fileInfo.Length) bytes)"
            $downloaded = $true
            break
        } else {
            Write-Host "Downloaded file is too small, trying next URL..."
            Remove-Item $jarFile -Force
        }
    } catch {
        Write-Host "Failed to download from $url"
        if (Test-Path $jarFile) {
            Remove-Item $jarFile -Force
        }
    }
}

if (!$downloaded) {
    Write-Host "Failed to download maven-wrapper.jar from all sources"
    Write-Host "Please download manually from: https://repo1.maven.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper.jar"
    Write-Host "And save it to: $jarFile"
    exit 1
}

Write-Host "Done! You can now run: .\mvnw.cmd spring-boot:run"
