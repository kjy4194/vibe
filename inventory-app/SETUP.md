# 창고 물품 관리 시스템 설치 가이드

## 기능 소개

이 애플리케이션은 창고 물품을 효율적으로 관리하기 위한 웹 애플리케이션입니다.

### 주요 기능:
- **사용자 인증**: Firebase Authentication을 통한 안전한 로그인/회원가입
- **물품 관리**: 물품의 추가, 수정, 삭제 및 사진 업로드
- **유통기한 관리**: 유통기한 경과 및 곧 만료될 물품에 대한 알림
- **출입 기록**: 물품의 입고/출고 기록 추적
- **통계 대시보드**: 물품 사용 현황, 사용자 활동 등 시각화된 통계
- **검색 및 필터링**: 물품명/설명으로 검색, 종류별 필터링

## 설치 방법

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정에서 웹 앱 추가
4. Firebase 구성 정보 복사

### 2. Firebase Authentication 설정

1. Firebase Console에서 "Authentication" 메뉴 선택
2. "Sign-in method" 탭에서 "Email/Password" 활성화
3. 필요한 경우 추가 인증 방법 활성화

### 3. Firestore Database 설정

1. Firebase Console에서 "Firestore Database" 메뉴 선택
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작 (개발용) 또는 프로덕션 모드 선택
4. 다음 보안 규칙 적용 (Firebase Console의 "규칙" 탭):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 정보는 인증된 사용자만 읽기 가능
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 물품 정보는 인증된 사용자만 읽기/쓰기 가능
    match /products/{productId} {
      allow read, write: if request.auth != null;
    }

    // 출입 기록은 인증된 사용자만 읽기/쓰기 가능
    match /records/{recordId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Firebase Storage 설정

1. Firebase Console에서 "Storage" 메뉴 선택
2. "시작하기" 클릭
3. 다음 보안 규칙 적용:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      // 인증된 사용자만 이미지 업로드 및 읽기 가능
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. 환경 변수 설정

1. 프로젝트 루트의 `.env.local` 파일 열기
2. Firebase 콘솔에서 복사한 구성 정보로 다음 값 채우기:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 6. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 사용 방법

### 1. 회원가입 및 로그인
- 처음 접속 시 회원가입 화면이 표시됩니다
- 이메일과 비밀번호로 계정 생성
- 생성한 계정으로 로그인

### 2. 물품 추가
- "물품 추가" 버튼 클릭
- 물품명, 종류, 설명, 수량, 유통기한 입력
- 선택적으로 물품 사진 업로드
- "추가" 버튼으로 저장

### 3. 물품 관리
- 각 물품 카드에서 편집/삭제 가능
- 유통기한에 따라 자동으로 색상 표시:
  - 🔴 빨강: 만료됨
  - 🟠 주황: 7일 이내 만료
  - 🟡 노랑: 30일 이내 만료
  - 🟢 초록: 정상

### 4. 출입 기록
- 물품 카드의 "출입 기록" 버튼 클릭
- 입고/출고 선택 및 수량 입력
- 선택적으로 메모 추가
- 기록 내역 확인

### 5. 통계 확인
- 상단 탭에서 "통계" 선택
- 전체 물품 수, 만료 현황 확인
- 물품 종류별 분포 차트
- 사용자별 활동 통계

## 데이터베이스 구조

### Collections

#### users
```typescript
{
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Timestamp;
}
```

#### products
```typescript
{
  name: string;
  type: string;
  description: string;
  quantity: number;
  expiryDate: Timestamp;
  photoUrl?: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### records
```typescript
{
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  quantity: number;
  userId: string;
  userName: string;
  note?: string;
  timestamp: Timestamp;
}
```

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase (Authentication, Firestore, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date handling**: date-fns

## 문제 해결

### Firebase 연결 오류
- `.env.local` 파일의 환경 변수가 정확한지 확인
- Firebase 프로젝트 설정에서 웹 앱이 등록되어 있는지 확인

### 인증 오류
- Firebase Console에서 Email/Password 인증이 활성화되어 있는지 확인

### 이미지 업로드 오류
- Firebase Storage가 활성화되어 있는지 확인
- Storage 보안 규칙이 올바르게 설정되어 있는지 확인

### 데이터 읽기/쓰기 오류
- Firestore 보안 규칙이 올바르게 설정되어 있는지 확인
- 사용자가 로그인되어 있는지 확인

## 라이선스

MIT
