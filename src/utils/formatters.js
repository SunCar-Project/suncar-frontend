/**
 * 숫자를 한국어 금액 표기 방식(억, 만원)으로 변환합니다.
 * ex) 250000000 -> 2억5000만원
 * 
 * @param {number} price - 변환할 가격
 * @returns {string} 변환된 가격 문자열
 */
const formatKoreanPrice = (price) => {
  const won = Math.floor(price);

  if (won >= 100000000) {
    const eok = Math.floor(won / 100000000);
    const man = Math.floor((won % 100000000) / 10000);

    if (man > 0) {
      return `${eok}억 ${man}만원`;
    }
    else {
      return `${eok}억원`;
    }
  }
  else if (won >= 10000) {
    const man = Math.floor(won / 10000);
    return `${man}만원`;
  }
  else {
    return `${won}원`;
  }
};

export default formatKoreanPrice;