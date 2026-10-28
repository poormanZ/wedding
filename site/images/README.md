사진을 이 폴더에 넣고 config.js의 photos 목록에 파일 이름을 적으세요.
첫 번째 사진이 대표 사진과 카카오톡 미리보기 이미지로 쓰입니다.
가로 1200px 이하, 장당 500KB 안팎으로 줄이면 모바일에서 빠르게 열립니다.

갤러리 격자는 `thumb/` 폴더의 같은 이름 파일(작은 버전)을 먼저 씁니다.
썸네일이 없으면 원본을 대신 보여주지만, 아래 명령으로 만들어 두면 훨씬 빠릅니다.

```sh
# macOS (site/images 폴더에서 실행)
mkdir -p thumb && for f in *.jpg; do sips -Z 480 -s format jpeg -s formatOptions 75 "$f" --out "thumb/$f"; done
```
