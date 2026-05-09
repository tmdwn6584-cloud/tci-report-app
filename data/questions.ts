export interface Question {
  id: string;
  text: string;
  dimension: "NS" | "HA" | "RD" | "P" | "SD" | "C" | "ST";
  reverse: boolean;
}

export const questions: Question[] = [
  // NS (자극추구) - 7문항
  { id: "ns1", text: "새로운 환경이나 낯선 사람들과 어울리는 것을 즐기며, 규칙적인 일상보다는 변화를 선호한다.", dimension: "NS", reverse: false },
  { id: "ns2", text: "예측 가능한 안정적인 삶보다는, 약간의 위험이 따르더라도 자극적인 도전을 해보고 싶다.", dimension: "NS", reverse: false },
  { id: "ns3", text: "갑작스러운 계획 변경이나 예상치 못한 상황이 발생하면 스트레스보다는 흥미를 느낀다.", dimension: "NS", reverse: false },
  { id: "ns4", text: "하던 일이 익숙해지면 금방 지루함을 느끼고 새로운 방식을 찾으려 노력한다.", dimension: "NS", reverse: false },
  { id: "ns5", text: "돈이나 에너지를 소비할 때 즉흥적이고 충동적인 결정을 자주 내리는 편이다.", dimension: "NS", reverse: false },
  { id: "ns6", text: "규칙이나 절차가 엄격한 곳에서는 심한 답답함을 느낀다.", dimension: "NS", reverse: false },
  { id: "ns7", text: "무언가를 결정할 때 충분히 조사하기보다 나의 직감이나 기분에 따를 때가 많다.", dimension: "NS", reverse: false },
  
  // HA (위험회피) - 7문항
  { id: "ha1", text: "상대방의 말투가 조금만 차가워져도 내가 무엇을 잘못했는지 하루 종일 고민하는 편이다.", dimension: "HA", reverse: false },
  { id: "ha2", text: "중요한 결정을 내릴 때 최악의 상황을 먼저 생각하고, 실수를 극도로 두려워한다.", dimension: "HA", reverse: false },
  { id: "ha3", text: "인간관계에서 갈등이 생길 조짐이 보이면, 먼저 피하거나 내 마음의 문을 닫아버리는 경우가 많다.", dimension: "HA", reverse: false },
  { id: "ha4", text: "낯선 상황에 던져졌을 때, 기대감보다는 긴장감과 피로를 먼저 느낀다.", dimension: "HA", reverse: false },
  { id: "ha5", text: "나쁜 일이 일어날지도 모른다는 생각에 사로잡혀 에너지를 소모하는 날이 잦다.", dimension: "HA", reverse: false },
  { id: "ha6", text: "타인에게 거절당하거나 상처받는 것이 두려워, 내 의견을 먼저 말하는 것을 피한다.", dimension: "HA", reverse: false },
  { id: "ha7", text: "어떤 일이든 완벽하게 준비되지 않으면 시작하기를 주저하게 된다.", dimension: "HA", reverse: false },
  
  // RD (사회적 민감성) - 7문항
  { id: "rd1", text: "이미 끝난 관계라도, 그 사람이 나를 어떻게 기억할지 종종 떠올려보고 미련을 갖는다.", dimension: "RD", reverse: false },
  { id: "rd2", text: "나에게 안정감을 주는 사람보다, 어딘가 결핍이 있어 내가 챙겨줘야 할 것 같은 사람에게 끌린다.", dimension: "RD", reverse: false },
  { id: "rd3", text: "타인의 감정 변화를 아주 예민하게 캐치하며, 상대의 기분에 따라 내 하루의 기분도 크게 좌우된다.", dimension: "RD", reverse: false },
  { id: "rd4", text: "내가 준 사랑이나 배려만큼 타인이 돌려주지 않으면 깊은 서운함을 느낀다.", dimension: "RD", reverse: false },
  { id: "rd5", text: "누군가 나를 칭찬하고 인정해주면, 그 사람에게 더 많이 맞춰주고 싶어진다.", dimension: "RD", reverse: false },
  { id: "rd6", text: "독립적으로 일하기보다 사람들과 정서적으로 교류하며 일할 때 에너지가 생긴다.", dimension: "RD", reverse: false },
  { id: "rd7", text: "마음을 터놓고 의지할 수 있는 깊은 관계가 내 삶의 원동력이라고 생각한다.", dimension: "RD", reverse: false },
  
  // P (인내력) - 7문항
  { id: "p1", text: "한번 시작한 일이나 맺은 관계는 상황이 어려워져도 쉽게 포기하지 않고 끝까지 유지하려 한다.", dimension: "P", reverse: false },
  { id: "p2", text: "피곤하고 지치더라도 내가 맡은 책임이나 역할은 완벽하게 끝내야 마음이 편하다.", dimension: "P", reverse: false },
  { id: "p3", text: "아무리 노력해도 결과가 보이지 않을 때, 다른 대안을 찾기보다는 더 노력해서 돌파하려 한다.", dimension: "P", reverse: false },
  { id: "p4", text: "과거의 성공 경험을 떠올리며, 현재의 고난을 묵묵히 버텨내는 힘이 강하다.", dimension: "P", reverse: false },
  { id: "p5", text: "주변 사람들이 포기하라고 만류해도, 내 스스로 만족할 때까지는 일을 멈추지 않는다.", dimension: "P", reverse: false },
  { id: "p6", text: "어려운 과제가 주어질수록 오히려 해내고 싶다는 강한 오기가 생긴다.", dimension: "P", reverse: false },
  { id: "p7", text: "게으름을 피우는 것을 스스로 용납하지 못하며, 항상 무언가 생산적인 일을 해야 직성이 풀린다.", dimension: "P", reverse: false },
  
  // SD (자율성) - 7문항
  { id: "sd1", text: "내 감정을 있는 그대로 표출하기보다, 상황과 내 목표에 맞게 감정을 통제하고 조절하는 데 능숙하다.", dimension: "SD", reverse: false },
  { id: "sd2", text: "다른 사람들이 나를 어떻게 생각하는지보다, 내 스스로 세운 가치관과 기준에 부합하는지가 훨씬 중요하다.", dimension: "SD", reverse: false },
  { id: "sd3", text: "실패를 겪더라도 누군가를 탓하기보다 내 스스로의 선택이었다고 받아들이고 다음을 준비한다.", dimension: "SD", reverse: false },
  { id: "sd4", text: "타인의 도움이나 조언 없이도 내 인생의 방향을 스스로 명확하게 설정할 수 있다.", dimension: "SD", reverse: false },
  { id: "sd5", text: "내가 하는 일의 의미와 목적을 나 자신 안에서 찾으며, 외부의 보상에 크게 흔들리지 않는다.", dimension: "SD", reverse: false },
  { id: "sd6", text: "과거의 상처에 얽매이기보다, 현재 내가 바꿀 수 있는 것에 집중하는 편이다.", dimension: "SD", reverse: false },
  { id: "sd7", text: "나의 단점을 잘 알고 있으며, 이를 외면하기보다 건설적으로 개선하려고 노력한다.", dimension: "SD", reverse: false },
  
  // C (연대감) - 7문항
  { id: "c1", text: "나에게 별다른 이득이 없더라도, 곤란에 처한 사람을 보면 기꺼이 내 시간과 에너지를 써서 돕고 싶다.", dimension: "C", reverse: false },
  { id: "c2", text: "모든 사람은 서로 연결되어 있으며, 타인의 아픔에 깊이 공감하고 이를 덜어주고 싶은 마음이 크다.", dimension: "C", reverse: false },
  { id: "c3", text: "관계를 맺을 때 나의 필요조건을 따지기보다, 서로 신뢰하고 존중하며 진심을 나누는 것이 가장 중요하다.", dimension: "C", reverse: false },
  { id: "c4", text: "경쟁을 통해 누군가를 이기는 것보다, 함께 협력하여 공동의 목표를 달성하는 것에 더 큰 보람을 느낀다.", dimension: "C", reverse: false },
  { id: "c5", text: "비록 나와 가치관이 다른 사람일지라도, 그의 입장에서 이해해보려고 진지하게 노력한다.", dimension: "C", reverse: false },
  { id: "c6", text: "다른 사람의 성공이나 행복을 진심으로 기뻐해 줄 수 있다.", dimension: "C", reverse: false },
  { id: "c7", text: "내가 한 행동이 타인이나 세상에 어떤 영향을 미칠지 항상 신중하게 고려한다.", dimension: "C", reverse: false },
  
  // ST (자기초월) - 7문항
  { id: "st1", text: "이해관계나 현실적인 이익을 넘어서, 삶의 근원적인 의미나 영적인 가치에 대해 깊이 생각하는 편이다.", dimension: "ST", reverse: false },
  { id: "st2", text: "사람들과 함께 있는 시간이 즐겁지만, 모임이 끝나고 집에 돌아오면 이유 모를 깊은 피로감과 허무함을 느끼곤 한다.", dimension: "ST", reverse: false },
  { id: "st3", text: "가끔은 내 자신이 우주나 자연의 아주 작은 일부로 느껴지며, 그 거대한 흐름에 나를 맡기고 싶을 때가 있다.", dimension: "ST", reverse: false },
  { id: "st4", text: "아름다운 예술 작품이나 자연 풍경을 마주할 때, 자아를 잃어버릴 정도로 깊이 몰입하곤 한다.", dimension: "ST", reverse: false },
  { id: "st5", text: "합리적이고 과학적인 설명으로는 풀리지 않는 신비로운 일들이 세상에 존재한다고 믿는다.", dimension: "ST", reverse: false },
  { id: "st6", text: "나에게 일어나는 우연한 사건들이 사실은 어떤 거대한 의미를 내포하고 있을 것이라 생각한다.", dimension: "ST", reverse: false },
  { id: "st7", text: "물질적인 성취보다 정신적인 성숙과 평화를 얻는 것이 인생의 궁극적인 목표라 생각한다.", dimension: "ST", reverse: false }
];
