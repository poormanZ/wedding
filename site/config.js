// 청첩장 내용은 이 파일만 고치면 됩니다.
window.INVITE = {
  groom: { name: "유상원", father: "유승한", mother: "이정애", relation: "아들" },
  bride: { name: "타니구치 유리", father: "타니구치 타케토시", mother: "타니구치 미키코", relation: "딸" },

  date: "2027-02-06T11:30:00+09:00", // 예식 시각
  venue: {
    name: "네이버 1784",
    hall: "그린웨딩홀",
    address: "경기도 성남시 분당구 정자일로 95 네이버 1784",
    transit: [
      { label: "전철", text: "정자역 3번 출구" },
      { label: "버스", text: "네이버 그린팩토리 or 아데나팰리스 정류장" },
      { label: "주차", text: "네이버 1784 지하주차장" }
    ]
  },

  greeting: [
    "서로의 계절이 되어 준 두 사람이",
    "이제 같은 겨울을 지나 봄을 맞으려 합니다.",
    "귀한 걸음으로 축복해 주시면",
    "오래도록 감사히 간직하겠습니다."
  ],

  // site/images 폴더에 파일을 넣고 이름을 적으세요. 첫 번째가 대표 사진입니다.
  photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"],

  accounts: {
    groom: [
      { who: "신랑", bank: "하나은행", number: "33791054048307", holder: "유상원" },
      { who: "신랑 아버지", bank: "은행", number: "000-0000-0000", holder: "유승한" },
      { who: "신랑 어머니", bank: "은행", number: "000-0000-0000", holder: "이정애" }
    ]
  }
};
