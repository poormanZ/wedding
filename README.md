# 모바일 청첩장

GitHub Pages + GitHub Actions로 배포하는 정적 모바일 청첩장입니다.

## 구성
```
.github/workflows/deploy.yml  main에 push하면 자동 배포
site/index.html               화면 구조, 미리보기(OG) 태그
site/ja/index.html            일본어판 (주소 끝에 /ja/ 를 붙이면 열림, 계좌 섹션 없음)
site/config.js                이름·일시·장소·인사말·계좌 (여기만 수정)
site/app.js                   달력, D-day, 갤러리, 복사·공유
site/style.css                디자인
site/images/                  사진 (01.jpg가 대표 사진)
site/images/thumb/            갤러리용 작은 사진 (만드는 법은 images/README.md)
site/audio/bgm.mp3            배경음악 (없으면 버튼이 안 보임, 자세한 건 audio/README.md)
```

## 처음 배포하기
1. 새 저장소를 만들고 이 폴더 내용을 그대로 push 합니다.
2. 저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 바꿉니다.
3. Actions 탭에서 `Deploy invitation`이 끝나면 `https://<아이디>.github.io/<저장소>/`에서 열립니다.

## 수정하기
- 내용: `site/config.js`. 일본어판 문구는 같은 파일의 `ja` 블록
- 미리보기 제목·설명: `site/index.html`, `site/ja/index.html`의 `<title>`, `og:title`, `og:description`
- 배경음악: `site/audio/bgm.mp3`로 넣기. 파일명을 바꾸면 `config.js`의 `bgm`도 같이 수정. 끄려면 `bgm: ""`
- 사진: `site/images/`에 넣고 `config.js`의 `photos`에 추가. 같은 이름으로 `thumb/`에 작은 버전도 만들면 갤러리가 빨라짐(없으면 원본을 씀)

## 참고
- 카카오톡은 미리보기를 캐시하므로, 대표 사진을 바꾼 뒤에는 카카오 개발자 사이트의 공유 디버거에서 캐시를 초기화해야 새 이미지가 보입니다.
- 공개 저장소면 계좌번호가 누구에게나 보입니다. 걱정되면 저장소를 private으로 두세요(Pages 사용 가능 여부는 요금제에 따라 다름).
