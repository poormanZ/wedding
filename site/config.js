// 청첩장 내용은 이 파일만 고치면 됩니다.
window.INVITE = {
  groom: { name: "유상원", father: "아버지 성함", mother: "어머니 성함", relation: "아들" },
  bride: { name: "신부 이름", father: "아버지 성함", mother: "어머니 성함", relation: "딸" },

  date: "2027-02-06T12:00:00+09:00", // 예식 시각
  venue: {
    name: "예식장 이름",
    hall: "홀 이름",
    address: "예식장 주소를 입력하세요",
    transit: [
      { label: "지하철", text: "가까운 역과 출구를 적어주세요" },
      { label: "버스", text: "정류장과 노선을 적어주세요" },
      { label: "주차", text: "주차 안내를 적어주세요 (설 연휴 혼잡 예상)" }
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
      { who: "신랑", bank: "은행", number: "000-0000-0000", holder: "유상원" },
      { who: "신랑 아버지", bank: "은행", number: "000-0000-0000", holder: "성함" }
    ],
    bride: [
      { who: "신부", bank: "은행", number: "000-0000-0000", holder: "성함" }
    ]
  }
};
