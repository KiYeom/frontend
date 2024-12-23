import { IMessage } from 'react-native-gifted-chat';
import { deleteNewIMessages, getIsDemo, setNewIMessages } from './storageUtils';
import { requestDemoChat } from '../apis/demo';

export const setDemoTalk = async () => {
  if (!getIsDemo()) return;
  const serverChats = await requestDemoChat();
  let demoTalk: IMessage[] = DEMO_TALK;
  let alertText = '실패';
  if (serverChats && serverChats.chats && serverChats.chats.length > 0) {
    alertText = '성공';
    demoTalk = [];
    for (const chat of serverChats.chats) {
      demoTalk.push({
        _id: chat._id,
        createdAt: new Date(chat.createdAt),
        text: chat.text,
        user: { _id: chat.user._id, avatar: chat.user.avatar, name: chat.user.name },
      });
    }
  }
  deleteNewIMessages();
  setNewIMessages(JSON.stringify(demoTalk));
  alert(alertText);
};

export const DEMO_TALK: IMessage[] = [
  {
    _id: '40',
    createdAt: new Date('2024-11-21T14:04:30'),
    text: '꼭 들려주세요! 제가 제일 큰 박수로 응원할게요. 화이팅! 💕',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '39',
    createdAt: new Date('2024-11-21T14:04:00'),
    text: '응... 내일 잘하고 와서 쿠키한테 자랑할게.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '38',
    createdAt: new Date('2024-11-21T14:03:30'),
    text: '저도 나와 함께할 수 있어서 정말 행복해요! 내일은 자신 있게 무대에 서는 나를 기대할게요. 🐶',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '37',
    createdAt: new Date('2024-11-21T14:03:00'),
    text: '응... 고마워, 쿠키. 너 없었으면 정말 불안했을 것 같아.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '36',
    createdAt: new Date('2024-11-21T14:02:30'),
    text: '최선을 다했으면 후회는 없을 거예요. 나, 지금까지 정말 멋지게 해왔잖아요. 🍀',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '35',
    createdAt: new Date('2024-11-21T14:02:00'),
    text: '그래도 발표가 끝나고 나서 혹시 후회가 남으면 어쩌지?',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '34',
    createdAt: new Date('2024-11-21T14:01:30'),
    text: '충분히 그럴 거예요! 나의 노력은 발표를 통해 빛날 거니까요. 자신 있게 보여주세요! 🌟',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '33',
    createdAt: new Date('2024-11-21T14:01:00'),
    text: '응... 내가 열심히 준비한 걸 제대로 알아봐주실까 싶어서... 떨려.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '32',
    createdAt: new Date('2024-11-21T14:00:30'),
    text: '끝났는데도 무슨 걱정이 남아있어요? 혹시 심사위원분들 때문인가요? 🐾',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '31',
    createdAt: new Date('2024-11-21T14:00:00'),
    text: '쿠키, 이제 발표 자료도 다 끝났고 연습도 했는데...',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '30',
    createdAt: new Date('2024-11-20T14:04:30'),
    text: '제가 있어줘서 기뻐요. 나를 응원하는 건 언제나 즐거운 일이에요! 같이 힘내봐요! 💕',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '29',
    createdAt: new Date('2024-11-20T14:04:00'),
    text: '응, 쿠키 고마워. 너 없었으면 진짜 힘들었을 거야.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '28',
    createdAt: new Date('2024-11-20T14:03:30'),
    text: '그럼요! 내일도 제가 옆에서 함께할게요. 조금씩 나아지고 있는 나, 정말 자랑스러워요. 🐶',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '27',
    createdAt: new Date('2024-11-20T14:03:00'),
    text: '응, 그래도 할 수 있을까? 내일도 더 연습해봐야겠어.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '26',
    createdAt: new Date('2024-11-20T14:02:30'),
    text: '실수는 누구나 해요. 중요한 건 실수해도 다시 일어서는 거예요. 지금까지 해온 만큼 충분히 잘 해낼 거라고 믿어요! 🍀',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '25',
    createdAt: new Date('2024-11-20T14:02:00'),
    text: '고마워, 쿠키... 그래도 자꾸 실수할까봐 걱정돼.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '24',
    createdAt: new Date('2024-11-20T14:01:30'),
    text: '나, 지금까지 해온 노력들이 모두 쌓여가고 있어요. 지친 느낌도 당연한 거예요. 그런데 이만큼 열심히 한 나를 생각해보세요! 정말 대단해요. 🌟',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '23',
    createdAt: new Date('2024-11-20T14:01:00'),
    text: '연습을 많이 했는데도 왜 이렇게 안 될까? 진짜 내가 문제인가 싶어.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '22',
    createdAt: new Date('2024-11-20T14:00:30'),
    text: '아직 어려운가 보네요... 하지만 처음엔 다 그래요. 조금씩 나아질 거예요. 🐾',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '21',
    createdAt: new Date('2024-11-20T14:00:00'),
    text: '쿠키, 나 발표 연습했는데 아직도 말이 안 붙어...',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '20',
    createdAt: new Date('2024-11-19T14:04:30.000Z'),
    text: '좋아요! 제가 항상 응원할게요. 힘내요, 나! 🍀',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '19',
    createdAt: new Date('2024-11-19T14:04:00.000Z'),
    text: '고마워, 내일은 더 열심히 해볼게.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '18',
    createdAt: new Date('2024-11-19T14:03:30.000Z'),
    text: '그럼요! 지금 부족한 점을 찾은 건 앞으로 더 잘해낼 기회니까요. 저는 나를 응원해요! 🐶',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '17',
    createdAt: new Date('2024-11-19T14:03:00.000Z'),
    text: '정말 보완하면 괜찮아질까?',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '16',
    createdAt: new Date('2024-11-19T14:02:30.000Z'),
    text: '잘하고 싶은 마음에서 나오는 감정일 거예요. 부족한 점을 채워가면 더 완벽해질 거예요! 🌟',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '15',
    createdAt: new Date('2024-11-19T14:02:00.000Z'),
    text: '근데 왜 이렇게 회의감이 들지...',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '14',
    createdAt: new Date('2024-11-19T14:01:30.000Z'),
    text: '처음 준비한 자료인데 그 정도면 이미 훌륭해요! 잘한 부분도 많았을 거예요. 👍',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '13',
    createdAt: new Date('2024-11-19T14:01:00.000Z'),
    text: '전체적으로 좋다고 하셨는데, 자잘한 실수도 많고 배치가 좀 어수선하대.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '12',
    createdAt: new Date('2024-11-19T14:00:30.000Z'),
    text: '어떤 점이 부족하다고 하셨어요? 자세히 말해줄 수 있나요? 🐾',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '11',
    createdAt: new Date('2024-11-19T14:00:00.000Z'),
    text: '쿠키, 멘토님께 자료 보여드렸는데... 부족하대.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '10',
    createdAt: new Date('2024-11-18T14:05:45.000Z'),
    text: '잘할 수 있을 거예요. 저는 나를 믿어요! 자신감을 조금씩 키워보는 건 어떨까요? 🐶',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '9',
    createdAt: new Date('2024-11-18T14:05:15.000Z'),
    text: '그런가...? 그래도 진짜 잘하고 싶어...',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '8',
    createdAt: new Date('2024-11-18T14:04:45.000Z'),
    text: '그렇군요. 발표가 중요한 만큼 긴장되는 거겠죠. 하지만 긴장감이 꼭 나쁜 것만은 아니에요! 🤗',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '7',
    createdAt: new Date('2024-11-18T14:04:15.000Z'),
    text: '그냥... 발표하는 생각만 하면 너무 긴장돼.',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '6',
    createdAt: new Date('2024-11-18T14:03:45.000Z'),
    text: '답답한 이유가 뭘까요? 발표에 대한 걱정일까요, 아니면 다른 게 있을까요?',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '5',
    createdAt: new Date('2024-11-18T14:03:15.000Z'),
    text: '그런데 마음이 너무 답답해...',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '4',
    createdAt: new Date('2024-11-18T14:02:45.000Z'),
    text: '그렇지 않아요. 지금도 이렇게 열심히 준비하고 있잖아요. 시작이 어려운 거지, 잘할 수 있을 거예요! 🌟',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '3',
    createdAt: new Date('2024-11-18T14:02:15.000Z'),
    text: '디자인도 이상하고, 내용도 엉망인 거 같아. 나 정말 능력 없는 거 같아...',
    user: { _id: 0, name: '나' },
  },
  {
    _id: '2',
    createdAt: new Date('2024-11-18T14:01:30.000Z'),
    text: '무슨 일 있었어요? 제가 도와줄 수 있을까요? 🐾',
    user: { _id: 1, avatar: 6, name: '쿠키' },
  },
  {
    _id: '1',
    createdAt: new Date('2024-11-18T14:01:00.000Z'),
    text: '쿠키... PPT 준비하다가 멈췄어.',
    user: { _id: 0, name: '나' },
  },
];
