
const getHourTips = () => {
  const hourNow = new Date().getHours()
  let tips = ''
  switch (hourNow) {
    case 0: tips = '现在已经过凌晨了，身体是无价的资本喔，小伙伴早点休息吧！'; break
    case 1: tips = '凌晨1点多了，工作是永远都做不完的，小伙伴别熬坏身子！'; break
    case 2: tips = '亲爱的小伙伴该休息了，身体可是革命的本钱啊！'; break
    case 3: tips = '夜深了，熬夜很容易导致身体内分泌失调，长痘痘的！'; break
    case 4: tips = '四点过了额(⊙o⊙)…，你明天不学习工作吗？？？'; break
    case 5: tips = '你知道吗，此时是国内网络速度最快的时候！'; break
    case 6: tips = '清晨好，这么早就来网站啦，谢谢小伙伴的关注哦，昨晚做的梦好吗？'; break
    case 7: tips = '新的一天又开始了，祝你过得快乐！'; break
    case 8: tips = '小伙伴早上好哦，一天之际在于晨，又是美好的一天！'; break
    case 9: case 10:
      tips = '上午好！今天你看上去好精神哦！'; break
    case 11: case 12:
      tips = '小伙伴啊！该吃午饭啦！有什么好吃的？您有中午休息的好习惯吗？'; break
    case 13: case 14: case 15: case 16: case 17:
      tips = '下午好！外面的天气好吗？记得朵朵白云曾捎来朋友殷殷的祝福。'; break
    case 18: case 19:
      tips = '太阳落山了！快看看夕阳吧！如果外面下雨，就不必了 ^_^ '; break
    case 20: case 21:
      tips = '忙碌了一天，累了吧？去看看最新的新闻资讯醒醒脑吧！'; break
    case 22: case 23:
      tips = '这么晚了，小伙伴还在上网？早点洗洗睡吧，睡前记得洗洗脸喔！'; break
    default: tips = 'Welcome！'; break
  }
  return tips
}

export {
  getHourTips
}
