# GitHub 저장소 자동 생성 스크립트
param(
    [string]$RepoName = "vibe_cursor",
    [string]$Description = "Inventory Management App",
    [string]$Visibility = "public"  # "public" 또는 "private"
)

# GitHub Personal Access Token이 필요합니다
# GitHub → Settings → Developer settings → Personal access tokens에서 생성하세요
$Token = Read-Host "GitHub Personal Access Token을 입력하세요"

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "토큰이 입력되지 않았습니다. 스크립트를 종료합니다."
    exit 1
}

# GitHub 사용자명 가져오기
$Headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

try {
    $UserResponse = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $Headers
    $Username = $UserResponse.login
    Write-Host "GitHub 사용자: $Username"
} catch {
    Write-Host "토큰 인증에 실패했습니다. 토큰을 확인해주세요."
    exit 1
}

# 저장소 생성
$RepoData = @{
    name = $RepoName
    description = $Description
    private = ($Visibility -eq "private")
    auto_init = $false
} | ConvertTo-Json

try {
    $RepoResponse = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $Headers -Body $RepoData -ContentType "application/json"
    Write-Host "저장소가 성공적으로 생성되었습니다: $($RepoResponse.html_url)"
    
    # Git 원격 저장소 추가
    $RepoUrl = $RepoResponse.clone_url
    Write-Host "원격 저장소 URL: $RepoUrl"
    
    # Git 명령어 실행
    Write-Host "Git 원격 저장소를 추가합니다..."
    & git remote add origin $RepoUrl
    
    Write-Host "코드를 푸시합니다..."
    & git push -u origin main
    
    Write-Host "완료! 저장소가 GitHub에 업로드되었습니다."
    Write-Host "저장소 URL: $($RepoResponse.html_url)"
    
} catch {
    Write-Host "저장소 생성 중 오류가 발생했습니다:"
    Write-Host $_.Exception.Message
    exit 1
}
