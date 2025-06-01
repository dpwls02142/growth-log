# 🚀 Frontend Growth Log

dpwls가 프런트엔드 개발자가 되기 위해 성장하는 로그

---
## ⚡ 시작하기

```bash
yarn install
yarn docs:dev   # 로컬 서버 실행
```

## ⚡ 옵시디언과 자동화 설정 방법
1. .env 파일에 `OBSIDIAN_VAULT_PATH` 명으로 자신의 옵시디언 파일 경로를 설정합니다.

- 예시:
    ```bash
    OBSIDIAN_VAULT_PATH=C:/Users/00/OneDrive/Desktop/public-obsidan
    ```

2. 배포전 로컬 환경에서 터미널에 `yarn obsidian-sync` 명령어를 입력합니다.

3. 아래와 같은 형태로 로그가 출력됩니다.
![Image](https://github.com/user-attachments/assets/bad0dd4b-c775-4b52-8875-1649e2b6bc37)

---

## 배포 환경 및 사용 이유

1. VitePress
- 이유: 마크다운을 자동으로 HTML로 변환해줌

2. Vercel
- 이유: 정적 사이트 배포에 특화된 플랫폼

3. gray-matter
- 이유: 마크다운 파일의 Front Matter(메타데이터)를 파싱하기 위해 사용

4. glob
- 이유: 옵시디언 볼트에서 모든 .md 파일을 재귀적으로 찾기 위해 사용