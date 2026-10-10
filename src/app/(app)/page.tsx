'use client';

import { useSyncExternalStore, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Target, BookOpen, Flame, Rocket, Trophy, CheckCircle2, Code, Dumbbell, Heart, Droplet, ArrowRight, Zap, ListChecks, Layers, Activity, Wallet, TrendingUp, TrendingDown, PiggyBank, HandCoins } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import ProgressBar from '@/components/shared/progress-bar';
import { Button } from '@/components/ui/button';
import { useLifeStore } from '@/store/use-store';
const moneyShort = (v: number) => {
  const sign = v < 0 ? '-' : '';
  const a = Math.abs(v);
  if (a >= 10000000) return `${sign}₹${(a / 10000000).toFixed(2)}Cr`;
  if (a >= 100000) return `${sign}₹${(a / 100000).toFixed(2)}L`;
  if (a >= 1000) return `${sign}₹${(a / 1000).toFixed(1)}k`;
  return `${sign}₹${a.toFixed(0)}`;
};

const motivationalQuotes = [
  // === Franz Kafka ===
  { text: 'A book must be the axe for the frozen sea within us.', author: 'Franz Kafka' },
  { text: 'I am a cage, in search of a bird.', author: 'Franz Kafka' },
  { text: 'Don\'t bend; don\'t water it down just because it\'s hard.', author: 'Franz Kafka' },
  { text: 'The meaning of life is that it stops.', author: 'Franz Kafka' },
  { text: 'Anyone who keeps the ability to see beauty never grows old.', author: 'Franz Kafka' },
  { text: 'Start with what is right rather than what is acceptable.', author: 'Franz Kafka' },
  { text: 'By believing passionately in something that still does not exist, we create it.', author: 'Franz Kafka' },
  { text: 'A non-writing writer is a monster courting insanity.', author: 'Franz Kafka' },
  { text: 'Better to have, and not need, than to need, and not have.', author: 'Franz Kafka' },
  { text: 'In the struggle between yourself and the world, back the world.', author: 'Franz Kafka' },
  // === Fyodor Dostoevsky ===
  { text: 'To be nothing — is that not a consolation?', author: 'Fyodor Dostoevsky' },
  { text: 'Man is sometimes extraordinarily, passionately, in love with suffering.', author: 'Fyodor Dostoevsky' },
  { text: 'The mystery of human existence lies not in just staying alive, but in finding something to live for.', author: 'Fyodor Dostoevsky' },
  { text: 'The darker the night, the brighter the stars.', author: 'Fyodor Dostoevsky' },
  { text: 'Above all, don\'t lie to yourself.', author: 'Fyodor Dostoevsky' },
  { text: 'To go wrong in one\'s own way is better than to go right in someone else\'s.', author: 'Fyodor Dostoevsky' },
  { text: 'Pain and suffering are always inevitable for a large intelligence and a deep heart.', author: 'Fyodor Dostoevsky' },
  { text: 'The soul is healed by being with children.', author: 'Fyodor Dostoevsky' },
  { text: 'Taking a new step, uttering a new word, is what people fear most.', author: 'Fyodor Dostoevsky' },
  { text: 'It is better to be unhappy and know the worst, than to be happy in a fool\'s paradise.', author: 'Fyodor Dostoevsky' },
  // === Leo Tolstoy ===
  { text: 'All happy families are alike; each unhappy family is unhappy in its own way.', author: 'Leo Tolstoy' },
  { text: 'There is no greatness where there is not simplicity, goodness, and truth.', author: 'Leo Tolstoy' },
  { text: 'The two most powerful warriors are patience and time.', author: 'Leo Tolstoy' },
  { text: 'Everyone thinks of changing the world, but no one thinks of changing himself.', author: 'Leo Tolstoy' },
  { text: 'If you look for perfection, you\'ll never be content.', author: 'Leo Tolstoy' },
  { text: 'Truth, like gold, is to be obtained not by its growth, but by washing away from it all that is not gold.', author: 'Leo Tolstoy' },
  { text: 'Wrong does not cease to be wrong because the majority share in it.', author: 'Leo Tolstoy' },
  { text: 'We are not disturbed by what happens to us, but by our thoughts about what happens.', author: 'Leo Tolstoy' },
  { text: 'All, everything that I understand, I understand only because I love.', author: 'Leo Tolstoy' },
  { text: 'Respect was invented to cover the empty place where love should be.', author: 'Leo Tolstoy' },
  // === Haruki Murakami ===
  { text: 'The only way out is through.', author: 'Haruki Murakami' },
  { text: 'Pain is inevitable. Suffering is optional.', author: 'Haruki Murakami' },
  { text: 'When you come out of the storm, you won\'t be the same person who walked in.', author: 'Haruki Murakami' },
  { text: 'Memories warm you up from the inside. But they also tear you apart.', author: 'Haruki Murakami' },
  { text: 'If you remember me, then I don\'t care if everyone else forgets.', author: 'Haruki Murakami' },
  { text: 'What happens when people open their hearts? They get better.', author: 'Haruki Murakami' },
  { text: 'I can bear any pain as long as it has meaning.', author: 'Haruki Murakami' },
  { text: 'Always remember that death is not the end of life, but part of it.', author: 'Haruki Murakami' },
  { text: 'Where there\'s no struggle, there\'s no strength.', author: 'Haruki Murakami' },
  { text: 'Not just beautiful, but the whole landscape of the soul.', author: 'Haruki Murakami' },
  // === Albert Camus ===
  { text: 'The struggle itself toward the heights is enough to fill a man\'s heart.', author: 'Albert Camus' },
  { text: 'In the midst of winter, I found there was, within me, an invincible summer.', author: 'Albert Camus' },
  { text: 'You will never be happy if you continue to search for what happiness consists of.', author: 'Albert Camus' },
  { text: 'Don\'t walk in front of me; I may not follow. Don\'t walk behind me; I may not lead. Walk beside me.', author: 'Albert Camus' },
  { text: 'Freedom is nothing but a chance to be better.', author: 'Albert Camus' },
  { text: 'Au milieu de l\'hiver, j\'ai découvert en moi un invincible été.', author: 'Albert Camus' },
  { text: 'A man without ethics is a wild beast loosed upon this world.', author: 'Albert Camus' },
  { text: 'The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.', author: 'Albert Camus' },
  { text: 'We must imagine Sisyphus happy.', author: 'Albert Camus' },
  { text: 'Real generosity towards the future lies in giving all to the present.', author: 'Albert Camus' },
  // === Friedrich Nietzsche ===
  { text: 'That which does not kill us makes us stronger.', author: 'Friedrich Nietzsche' },
  { text: 'He who has a why to live for can bear almost any how.', author: 'Friedrich Nietzsche' },
  { text: 'Without music, life would be a mistake.', author: 'Friedrich Nietzsche' },
  { text: 'To live is to suffer, to survive is to find some meaning in the suffering.', author: 'Friedrich Nietzsche' },
  { text: 'One must still have chaos in oneself to be able to give birth to a dancing star.', author: 'Friedrich Nietzsche' },
  { text: 'The individual has always had to struggle to keep from being overwhelmed by the tribe.', author: 'Friedrich Nietzsche' },
  { text: 'There are no facts, only interpretations.', author: 'Friedrich Nietzsche' },
  { text: 'What does not destroy me, makes me stronger.', author: 'Friedrich Nietzsche' },
  { text: 'Amor fati — love your fate.', author: 'Friedrich Nietzsche' },
  { text: 'You have your way. I have my way. As for the right way, it does not exist.', author: 'Friedrich Nietzsche' },
  // === Rabindranath Tagore ===
  { text: 'It is a happy talent to know how to play.', author: 'Rabindranath Tagore' },
  { text: 'Death is not extinguishing the light; it is putting out the lamp because the dawn has come.', author: 'Rabindranath Tagore' },
  { text: 'The butterfly counts not months but moments, and has time enough.', author: 'Rabindranath Tagore' },
  { text: 'Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.', author: 'Rabindranath Tagore' },
  { text: 'Let your life lightly dance on the edges of Time like dew on the tip of a leaf.', author: 'Rabindranath Tagore' },
  { text: 'The world speaks to me in colors, my soul answers in music.', author: 'Rabindranath Tagore' },
  { text: 'You can\'t cross the sea merely by standing and staring at the water.', author: 'Rabindranath Tagore' },
  { text: 'Depth of friendship does not depend on length of acquaintance.', author: 'Rabindranath Tagore' },
  { text: 'I slept and dreamt that life was joy. I awoke and saw that life was service. I acted and behold, service was joy.', author: 'Rabindranath Tagore' },
  { text: 'In the world\'s audience hall, the simple blade of grass sits on the same carpet with the sunbeam.', author: 'Rabindranath Tagore' },
  // === Rumi ===
  { text: 'The wound is the place where the Light enters you.', author: 'Rumi' },
  { text: 'Don\'t grieve. Anything you lose comes round in another form.', author: 'Rumi' },
  { text: 'You were born with wings, why prefer to crawl through life?', author: 'Rumi' },
  { text: 'Let yourself be silently drawn by the strange pull of what you really love.', author: 'Rumi' },
  { text: 'The art of knowing is knowing what to ignore.', author: 'Rumi' },
  { text: 'Lift up your head, you are already free. There is no chain that binds you.', author: 'Rumi' },
  { text: 'Do not be satisfied with the stories that have been told. Unfold your own myth.', author: 'Rumi' },
  { text: 'This is love: to fly toward a secret sky, to cause a hundred veils to fall each moment.', author: 'Rumi' },
  { text: 'Why do you stay in prison when the door is so wide open?', author: 'Rumi' },
  { text: 'Forget safety. Live where you fear to live.', author: 'Rumi' },
  // === Premchand (Hindi) ===
  { text: 'दुनिया में रहना है तो दुनिया से लड़ना होगा।', author: 'Premchand' },
  { text: 'नफरत से नफरत बढ़ती है, प्यार से प्यार।', author: 'Premchand' },
  { text: 'जीवन एक संघर्ष है, जीत उसी की होती है जो हार कर भी नहीं हारता।', author: 'Premchand' },
  { text: 'आदमी बड़ा होता है अपने कर्मों से, न कि जन्म से।', author: 'Premchand' },
  { text: 'सच्चा प्रेम वही है जो बदले में कुछ न माँगे।', author: 'Premchand' },
  { text: 'कठिनाइयाँ ही जीवन को सार्थक बनाती हैं।', author: 'Premchand' },
  { text: 'अपने अधिकारों के लिए लड़ना हर व्यक्ति का कर्तव्य है।', author: 'Premchand' },
  { text: 'समय बड़ा बलवान है, पर मनुष्य का संकल्प उससे भी बड़ा।', author: 'Premchand' },
  { text: 'जो लोग सपने नहीं देखते, वे कभी बड़ा नहीं कर सकते।', author: 'Premchand' },
  { text: 'सच्चाई की जीत हमेशा होती है, भले ही देर से।', author: 'Premchand' },
  // === Harivansh Rai Bachchan (Hindi) ===
  { text: 'अकेला चलो, चलो अकेला — राह में मिलेंगे साथी अपने।', author: 'Harivansh Rai Bachchan' },
  { text: 'मंज़िल मिले या न मिले, यह तो पता नहीं — मगर क़दम बढ़ाने का हौसला मत छोड़ो।', author: 'Harivansh Rai Bachchan' },
  { text: 'जिंदगी की राहों में काँटे ही काँटे हैं, फूल तो बस सपनों में हैं।', author: 'Harivansh Rai Bachchan' },
  { text: 'हारने वालों को भी जीतने का मौका मिलता है, अगर वे हार मानने से इनकार कर दें।', author: 'Harivansh Rai Bachchan' },
  { text: 'अपना दर्द लिए फिरते हैं लोग, मुस्कुराते हुए भी।', author: 'Harivansh Rai Bachchan' },
  { text: 'जीवन में कुछ पाने के लिए कुछ खोना भी पड़ता है।', author: 'Harivansh Rai Bachchan' },
  { text: 'तेरे आने से पहले मैं भी एक सपना था।', author: 'Harivansh Rai Bachchan' },
  { text: 'दर्द को अपनी कमज़ोरी मत समझो, यही तुम्हारी ताकत बनेगा।', author: 'Harivansh Rai Bachchan' },
  // === Kabir (Hindi) ===
  { text: 'बुरा जो देखन मैं चला, बुरा न मिलिया कोय।', author: 'Kabir' },
  { text: 'धीरे-धीरे रे मना, धीरे सब कुछ होय।', author: 'Kabir' },
  { text: 'माटी कहै कुम्हार से, तू क्या रौंदे मोय।', author: 'Kabir' },
  { text: 'काल करे सो आज कर, आज करे सो अब।', author: 'Kabir' },
  { text: 'जैसी भावना जैसा भाव, वैसा पावे फल।', author: 'Kabir' },
  { text: 'पोथी पढ़ पढ़ जग मुआ, पंडित भया न कोय।', author: 'Kabir' },
  { text: 'साईं इतना दीजिए, जामें कुटुम्ब समाये।', author: 'Kabir' },
  { text: 'निंदक नियरे राखिए, ऑंगन कुटी छवाय।', author: 'Kabir' },
  // === Mahatma Gandhi ===
  { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi' },
  { text: 'An eye for an eye only ends up making the whole world blind.', author: 'Mahatma Gandhi' },
  { text: 'Happiness is when what you think, what you say, and what you do are in harmony.', author: 'Mahatma Gandhi' },
  { text: 'Strength does not come from physical capacity. It comes from an indomitable will.', author: 'Mahatma Gandhi' },
  { text: 'You must be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'First they ignore you, then they laugh at you, then they fight you, then you win.', author: 'Mahatma Gandhi' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'In a gentle way, you can shake the world.', author: 'Mahatma Gandhi' },
  // === Albert Einstein ===
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Everything that can be counted does not necessarily count; everything that counts cannot necessarily be counted.', author: 'Albert Einstein' },
  { text: 'Imagination is more important than knowledge.', author: 'Albert Einstein' },
  { text: 'Life is like riding a bicycle. To keep your balance you must keep moving.', author: 'Albert Einstein' },
  { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein' },
  { text: 'The important thing is not to stop questioning.', author: 'Albert Einstein' },
  { text: 'Insanity: doing the same thing over and over again and expecting different results.', author: 'Albert Einstein' },
  { text: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', author: 'Albert Einstein' },
  { text: 'Try not to become a man of success, but rather try to become a man of value.', author: 'Albert Einstein' },
  { text: 'The only source of knowledge is experience.', author: 'Albert Einstein' },
  // === Stephen Chbosky ===
  { text: 'We accept the love we think we deserve.', author: 'Stephen Chbosky' },
  { text: 'And in that moment, I swear we were infinite.', author: 'Stephen Chbosky' },
  { text: 'Things change. And friends leave. Life doesn\'t stop for anybody.', author: 'Stephen Chbosky' },
  { text: 'We are infinite.', author: 'Stephen Chbosky' },
  // === Kurt Vonnegut ===
  { text: 'So it goes.', author: 'Kurt Vonnegut' },
  { text: 'We are what we pretend to be, so we must be careful about what we pretend to be.', author: 'Kurt Vonnegut' },
  { text: 'Everything was beautiful and nothing hurt.', author: 'Kurt Vonnegut' },
  { text: 'I urge you to please notice when you are happy, and exclaim or murmur or think at some point, \'If this isn\'t nice, I don\'t know what is.\'', author: 'Kurt Vonnegut' },
  { text: 'We have to continually be jumping off cliffs and developing our wings on the way down.', author: 'Kurt Vonnegut' },
  // === Naruto ===
  { text: 'Those who break the rules are scum, but those who abandon their friends are worse than scum.', author: 'Kakashi Hatake (Naruto)' },
  { text: 'I never go back on my word, because that\'s my nindo — my ninja way.', author: 'Naruto Uzumaki' },
  { text: 'A person grows up when they\'re able to overcome hardships.', author: 'Naruto Uzumaki' },
  { text: 'When people get hurt, they learn to hate. When people hurt others, they become hated and racked with guilt. But knowing that pain allows people to be kind.', author: 'Naruto Uzumaki' },
  { text: 'Hard work is worthless for those that don\'t believe in themselves.', author: 'Naruto Uzumaki' },
  { text: 'The pain of being alone is not something that anyone can get used to.', author: 'Gaara (Naruto)' },
  { text: 'It\'s not the face that makes someone a monster; it\'s the choices they make with their lives.', author: 'Naruto Uzumaki' },
  { text: 'If you don\'t like your destiny, don\'t accept it. Instead, have the courage to change it.', author: 'Naruto Uzumaki' },
  { text: 'The moment you think of giving up, think of the reason why you held on so long.', author: 'Naruto Uzumaki' },
  { text: 'A place where someone still thinks about you is a place you can call home.', author: 'Jiraiya (Naruto)' },
  { text: 'When you give up, that\'s when the game ends.', author: 'Rock Lee (Naruto)' },
  { text: 'The concept of hope is nothing more than giving up. A word that doesn\'t exist.', author: 'Madara Uchiha (Naruto)' },
  { text: 'Wake up to reality. Nothing ever goes as planned in this world.', author: 'Madara Uchiha (Naruto)' },
  { text: 'In the ninja world, those who break the rules are scum. But those who abandon their friends are even worse.', author: 'Kakashi Hatake (Naruto)' },
  { text: 'My dream is to become the greatest Hokage — the one who surpasses all others!', author: 'Naruto Uzumaki' },
  // === One Piece ===
  { text: 'The difference between the novice and the master is that the master has failed more times than the novice has tried.', author: 'Kuro (One Piece)' },
  { text: 'Power is not determined by your size, but by the size of your heart and dreams.', author: 'Monkey D. Luffy' },
  { text: 'I don\'t want to conquer anything. I just think the person with the most freedom in this world is the Pirate King.', author: 'Monkey D. Luffy' },
  { text: 'When do you think people die? When they are shot through the heart? No. When they are ravaged by an incurable disease? No. When they drink a soup made from a poisonous mushroom? No. It\'s when they are forgotten.', author: 'Dr. Hiluluk (One Piece)' },
  { text: 'A real treasure isn\'t just gold and power. It\'s the memories you create with your friends.', author: 'Silvers Rayleigh (One Piece)' },
  { text: 'Nothing happened.', author: 'Roronoa Zoro (One Piece)' },
  { text: 'If you can\'t stand up for what you believe in, then you don\'t deserve to live.', author: 'Roronoa Zoro (One Piece)' },
  { text: 'Give up on your dreams and die.', author: 'Roronoa Zoro (One Piece)' },
  { text: 'Perfection is not attainable. But if we chase perfection, we can catch excellence.', author: 'Vinsmoke Sanji (One Piece)' },
  { text: 'Inherited will, the destiny of the age, and the dreams of the people — as long as people continue to pursue the meaning of freedom, these things will never cease.', author: 'Gol D. Roger (One Piece)' },
  { text: 'I don\'t care who you are. If you hurt my friend, I won\'t forgive you.', author: 'Monkey D. Luffy' },
  { text: 'Even if you\'re not a strong person, you can still protect what\'s important to you.', author: 'Monkey D. Luffy' },
  { text: 'It\'s not some sort of crime to have a dream.', author: 'Monkey D. Luffy' },
  { text: 'I\'ve set myself to become the King of Pirates, and I\'ll die trying!', author: 'Monkey D. Luffy' },
  { text: 'Suffering is also a part of the journey.', author: 'Monkey D. Luffy' },
  // === Attack on Titan ===
  { text: 'If you win, you live. If you lose, you die. If you don\'t fight, you can\'t win.', author: 'Eren Yeager (AOT)' },
  { text: 'The world is cruel, but also beautiful.', author: 'Mikasa Ackerman (AOT)' },
  { text: 'No one knows what the result will be. So just keep moving forward.', author: 'Eren Yeager (AOT)' },
  { text: 'Give up on your dreams and die. If you don\'t have the resolve to kill, you have no right to live.', author: 'Eren Yeager (AOT)' },
  { text: 'It\'s not about being possible or not. I have to do it.', author: 'Eren Yeager (AOT)' },
  { text: 'The only thing we\'re allowed to do is to believe that we won\'t regret the choices we make.', author: 'Levi Ackerman (AOT)' },
  { text: 'No matter how deep the night, morning always comes.', author: 'Levi Ackerman (AOT)' },
  { text: 'Instead of crying for help, just do something about it.', author: 'Erwin Smith (AOT)' },
  { text: 'My soldiers, push forward! My soldiers, scream out! My soldiers, rage!', author: 'Erwin Smith (AOT)' },
  { text: 'If you don\'t sacrifice something, you can never change anything.', author: 'Eren Yeager (AOT)' },
  { text: 'People are not strong because they are born strong. They become strong because they have no choice.', author: 'Eren Yeager (AOT)' },
  { text: 'Dedicate your heart!', author: 'Survey Corps (AOT)' },
  { text: 'Someone who cannot sacrifice everything cannot change anything.', author: 'Armin Arlert (AOT)' },
  { text: 'Sometimes the only thing you can do is keep moving forward.', author: 'Eren Yeager (AOT)' },
  { text: 'Open your eyes. This world is cruel — and it\'s also very beautiful.', author: 'Mikasa Ackerman (AOT)' },
  // === Death Note ===
  { text: 'I\'ll become the god of the new world.', author: 'Light Yagami (Death Note)' },
  { text: 'This world is rotten, and those who are making it rot deserve to die.', author: 'Light Yagami (Death Note)' },
  { text: 'A perfect world is a world where there is no crime.', author: 'Light Yagami (Death Note)' },
  { text: 'I am the justice. I protect the innocent and those who fear evil.', author: 'Light Yagami (Death Note)' },
  { text: 'Humans are so interesting. They can find hope in the darkest of places.', author: 'Ryuk (Death Note)' },
  { text: 'A god of death who falls in love with a human is the most pitiful creature in the world.', author: 'Ryuk (Death Note)' },
  { text: 'There are many types of monsters in this world. The ones who wear masks are the most dangerous.', author: 'L (Death Note)' },
  { text: 'The moment you stop believing in yourself, that\'s when you lose.', author: 'L (Death Note)' },
  { text: 'Nothing in this world happens by chance. Everything has a cause and effect.', author: 'L (Death Note)' },
  { text: 'The only one who can judge a criminal is a god.', author: 'Light Yagami (Death Note)' },
  // === Fullmetal Alchemist ===
  { text: 'Equivalent exchange. To obtain, something of equal value must be lost.', author: 'Fullmetal Alchemist' },
  { text: 'A lesson without pain is meaningless. For you cannot gain something without sacrificing something else.', author: 'Edward Elric (FMA)' },
  { text: 'Being a genius doesn\'t mean anything if you don\'t have the will to back it up.', author: 'Roy Mustang (FMA)' },
  { text: 'It\'s a terrible thing to be alone. But if you have someone who believes in you, you can do anything.', author: 'Edward Elric (FMA)' },
  { text: 'There\'s no such thing as a painless lesson. They just don\'t exist.', author: 'Edward Elric (FMA)' },
  { text: 'If you\'re not willing to risk it, you can\'t create a future.', author: 'Edward Elric (FMA)' },
  { text: 'The world isn\'t perfect. But it\'s there for us, doing the best it can.', author: 'Van Hohenheim (FMA)' },
  { text: 'Stand up and walk. Keep moving forward. You\'ve got a good pair of legs.', author: 'Van Hohenheim (FMA)' },
  { text: 'You must not underestimate the power of a small sacrifice.', author: 'Roy Mustang (FMA)' },
  { text: 'Just because you\'re right doesn\'t mean you\'re correct.', author: 'King Bradley (FMA)' },
  // === Cowboy Bebop ===
  { text: 'You\'re gonna carry that weight.', author: 'Cowboy Bebop' },
  { text: 'Whatever happens, happens.', author: 'Spike Spiegel (Cowboy Bebop)' },
  { text: 'I\'m not going there to die. I\'m going to find out if I\'m really alive.', author: 'Spike Spiegel (Cowboy Bebop)' },
  { text: 'Everything has a beginning and an ending. Make peace with that.', author: 'Jet Black (Cowboy Bebop)' },
  { text: 'Life is but a dream.', author: 'Faye Valentine (Cowboy Bebop)' },
  { text: 'The past is just a memory. The future is just a dream.', author: 'Cowboy Bebop' },
  { text: 'I\'ve always been alone. I don\'t need anyone else.', author: 'Spike Spiegel (Cowboy Bebop)' },
  { text: 'Some things you just can\'t change. You just have to live with them.', author: 'Jet Black (Cowboy Bebop)' },
  // === Neon Genesis Evangelion ===
  { text: 'Hesitation is a seed of defeat.', author: 'Evangelion' },
  { text: 'Anywhere can be paradise if you have the will to live. After all, you are alive. So you will always have the chance to be happy.', author: 'Evangelion' },
  { text: 'If you run away, you gain nothing. If you face it, you might gain something.', author: 'Evangelion' },
  { text: 'People cannot gain real happiness from other people. Happiness can only be achieved through one\'s own will.', author: 'Evangelion' },
  { text: 'The weak fear the unknown. The strong embrace it.', author: 'Evangelion' },
  { text: 'As long as you\'re alive, there\'s always a chance to be happy.', author: 'Yui Ikari (Evangelion)' },
  { text: 'I\'m not going to run away. I\'m not going to run away anymore.', author: 'Shinji Ikari (Evangelion)' },
  { text: 'If you can\'t communicate, the only thing you can do is fight.', author: 'Evangelion' },
  // === Studio Ghibli ===
  { text: 'Once you meet someone, you never really forget them.', author: 'Spirited Away' },
  { text: 'It\'s not really important what color your dress is. What matters is the heart inside.', author: 'Spirited Away' },
  { text: 'Always believe in yourself. Do this and no matter where you are, you will have nothing to fear.', author: 'Spirited Away' },
  { text: 'The past is the same as the future. Both are distant and unknown.', author: 'The Girl Who Leapt Through Time' },
  { text: 'Time waits for no one.', author: 'The Girl Who Leapt Through Time' },
  { text: 'A smile is the universal welcome.', author: 'My Neighbor Totoro' },
  { text: 'Life is a winking light in the darkness.', author: 'Howl\'s Moving Castle' },
  { text: 'They say that the best blaze burns brightest when circumstances are against it.', author: 'Howl\'s Moving Castle' },
  { text: 'No matter how many weapons you have, no matter how great your technology, the world cannot live without love.', author: 'Castle in the Sky' },
  { text: 'Just follow your heart and keep smiling.', author: 'Kiki\'s Delivery Service' },
  // === Hunter x Hunter ===
  { text: 'You should enjoy the little detours. To the fullest. Because that\'s where you\'ll find the things more important than what you want.', author: 'Hunter x Hunter' },
  { text: 'Aim for the top. That\'s the only way you\'ll ever make it.', author: 'Hunter x Hunter' },
  { text: 'There is no such thing as a coincidence in this world. There is only the inevitable.', author: 'Hunter x Hunter' },
  { text: 'The world is not as simple as you think. It\'s far more complicated and vast.', author: 'Hunter x Hunter' },
  { text: 'Sometimes the best way to solve your own problems is to help someone else.', author: 'Hunter x Hunter' },
  { text: 'It\'s not whether you\'re strong or weak. It\'s about what you want to protect.', author: 'Hunter x Hunter' },
  { text: 'Fear is freedom. Control is liberation. Contradiction is truth.', author: 'Hunter x Hunter' },
  // === Bleach ===
  { text: 'If you were to die now, who would mourn for you?', author: 'Ichigo Kurosaki (Bleach)' },
  { text: 'We fear what we don\'t understand.', author: 'Bleach' },
  { text: 'The blade itself is not enough. You must have the will to use it.', author: 'Bleach' },
  { text: 'Belief is power.', author: 'Bleach' },
  { text: 'There is no difference between the living and the dead. The only difference is the heart.', author: 'Bleach' },
  { text: 'If you don\'t have the resolve to take a life, then you have no right to protect one.', author: 'Bleach' },
  { text: 'Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger.', author: 'Bleach' },
  // === Dragon Ball Z ===
  { text: 'It\'s not about the destination, it\'s about the journey.', author: 'Goku (DBZ)' },
  { text: 'The only limits we have are the ones we impose on ourselves.', author: 'Vegeta (DBZ)' },
  { text: 'I am the prince of all Saiyans!', author: 'Vegeta (DBZ)' },
  { text: 'Power comes in response to a need, not a desire.', author: 'Goku (DBZ)' },
  { text: 'Defeat is just a step towards victory.', author: 'Gohan (DBZ)' },
  { text: 'Even a low-class warrior can surpass an elite with hard work.', author: 'Vegeta (DBZ)' },
  { text: 'Surpass your limits. Right here, right now.', author: 'Goku (DBZ)' },
  { text: 'To be defeated is not a disgrace. To give up is.', author: 'Goku (DBZ)' },
  // === Demon Slayer ===
  { text: 'No matter how hard it is, no matter how painful, you must keep moving forward.', author: 'Tanjiro Kamado (Demon Slayer)' },
  { text: 'Set your heart ablaze.', author: 'Rengoku Kyojuro (Demon Slayer)' },
  { text: 'If you are feeling down, just keep moving forward.', author: 'Tanjiro Kamado (Demon Slayer)' },
  { text: 'The difference between an amateur and a professional is perseverance.', author: 'Demon Slayer' },
  { text: 'A person\'s true strength comes not from their physical abilities but from their will to protect others.', author: 'Tanjiro Kamado (Demon Slayer)' },
  { text: 'Being weak is nothing to be ashamed of. Staying weak is.', author: 'Demon Slayer' },
  { text: 'Your life is like a flame — never let it burn out.', author: 'Rengoku Kyojuro (Demon Slayer)' },
  // === Jujutsu Kaisen ===
  { text: 'We don\'t need a reason to help someone.', author: 'Satoru Gojo (JJK)' },
  { text: 'Throughout heaven and earth, I alone am the honored one.', author: 'Satoru Gojo (JJK)' },
  { text: 'Are you the strongest because you\'re Gojo Satoru? Or are you Gojo Satoru because you\'re the strongest?', author: 'Jujutsu Kaisen' },
  { text: 'If you die, you\'re dead. If you live, you live. That\'s all there is to it.', author: 'Yuji Itadori (JJK)' },
  { text: 'Don\'t worry, I\'m the strongest.', author: 'Satoru Gojo (JJK)' },
  { text: 'When you die, you should be surrounded by people who love you.', author: 'Yuji Itadori (JJK)' },
  { text: 'It\'s not about whether it\'s possible. It\'s about whether you want it or not.', author: 'Jujutsu Kaisen' },
  // === Steins;Gate ===
  { text: 'I\'m a mad scientist. It\'s so cool! Sonuvabitch!', author: 'Okabe Rintaro (Steins;Gate)' },
  { text: 'Time waits for no one. It flows ever onward.', author: 'Steins;Gate' },
  { text: 'The choice of Steins;Gate is what made this possible.', author: 'Steins;Gate' },
  { text: 'No matter what happens, I will always be on your side.', author: 'Steins;Gate' },
  { text: 'Even if I have to defy the world, I will save you.', author: 'Steins;Gate' },
  // === Vinland Saga ===
  { text: 'A true warrior needs no sword.', author: 'Thors (Vinland Saga)' },
  { text: 'You have no enemies. No one is your enemy. No one is meant to be your enemy.', author: 'Thors (Vinland Saga)' },
  { text: 'The weak exist to give the strong something to protect.', author: 'Vinland Saga' },
  { text: 'A man is defined by his actions, not his words.', author: 'Vinland Saga' },
  { text: 'Revenge is never a solution. It only creates more suffering.', author: 'Vinland Saga' },
  { text: 'War does not determine who is right — only who is left.', author: 'Vinland Saga' },
  // === Vagabond ===
  { text: 'There is no light without shadow. There is no life without death.', author: 'Vagabond' },
  { text: 'The strongest have no need for technique.', author: 'Vagabond' },
  { text: 'Everything exists for a reason. And that reason is to fight.', author: 'Vagabond' },
  { text: 'True strength is not about defeating others. It\'s about protecting what matters.', author: 'Vagabond' },
  { text: 'To be invincible is to be human.', author: 'Vagabond' },
  // === Berserk ===
  { text: 'Struggle, endure, contend. For that alone is the sword of one who defies fate.', author: 'Berserk' },
  { text: 'Just keep moving forward. Don\'t stop. Don\'t turn back.', author: 'Guts (Berserk)' },
  { text: 'It is not that we have a short time to live, but that we waste most of it.', author: 'Berserk' },
  { text: 'A true friend is one who will never abandon you in times of need.', author: 'Berserk' },
  { text: 'You will learn that sometimes the most painful things are also the most necessary.', author: 'Berserk' },
  // === Tokyo Ghoul ===
  { text: 'The world is not wrong. It just is.', author: 'Tokyo Ghoul' },
  { text: 'If you were to write a story with me in the lead role, it would certainly be a tragedy.', author: 'Ken Kaneki (Tokyo Ghoul)' },
  { text: 'I can\'t die yet. I still have things I need to do.', author: 'Ken Kaneki (Tokyo Ghoul)' },
  { text: 'Tragedy is not the end. It is a new beginning.', author: 'Tokyo Ghoul' },
  { text: 'It\'s not the world that\'s cruel. It\'s us humans who are cruel to each other.', author: 'Tokyo Ghoul' },
  // === A Silent Voice ===
  { text: 'No matter what happens, you have to keep living.', author: 'A Silent Voice' },
  { text: 'It\'s not about being forgiven. It\'s about forgiving yourself.', author: 'A Silent Voice' },
  { text: 'The things I\'ve done can never be undone. But I can try to do better.', author: 'A Silent Voice' },
  { text: 'Life is full of pain. But it\'s also full of beauty.', author: 'A Silent Voice' },
  // === Your Name (Kimi no Na wa) ===
  { text: 'Who are you? I\'ve been searching for you, someone I\'ve never met.', author: 'Your Name' },
  { text: 'No matter where you are in the world, I will search for you.', author: 'Your Name' },
  { text: 'The memories we share are not just memories. They are a part of who we are.', author: 'Your Name' },
  { text: 'Even if we never meet again, I will never forget you.', author: 'Your Name' },
  // === Weathering With You ===
  { text: 'The world has been crazy ever since we fell in love.', author: 'Weathering With You' },
  { text: 'No matter how sunny the world gets, you are the only one I need.', author: 'Weathering With You' },
  // === Code Geass ===
  { text: 'The only ones who should kill, are those who are prepared to be killed.', author: 'Lelouch vi Britannia (Code Geass)' },
  { text: 'If the king doesn\'t move, his subjects won\'t follow.', author: 'Lelouch vi Britannia (Code Geass)' },
  { text: 'A king must live a life greater than any other, and be an example for his people.', author: 'Lelouch vi Britannia (Code Geass)' },
  { text: 'The path of the righteous is not always easy. But it is the only path worth taking.', author: 'Code Geass' },
  // === One Punch Man ===
  { text: 'I\'m not a hero because I want recognition. I\'m a hero because I want to be one.', author: 'Saitama (OPM)' },
  { text: 'In order to be a true hero, you must be willing to sacrifice everything.', author: 'Saitama (OPM)' },
  { text: 'The real hero is not the one who wins, but the one who saves someone\'s life.', author: 'Mumen Rider (OPM)' },
  { text: 'Limits are just obstacles that we create in our minds.', author: 'Saitama (OPM)' },
  // === Mob Psycho 100 ===
  { text: 'If you don\'t like your past, change it. If you can\'t change it, change the way you think about it.', author: 'Mob Psycho 100' },
  { text: 'Growth occurs when one goes beyond one\'s limits.', author: 'Mob Psycho 100' },
  { text: 'Just being alive is a miracle.', author: 'Mob Psycho 100' },
  { text: 'The greatest power is the power of human kindness.', author: 'Mob Psycho 100' },
  // === Hajime no Ippo ===
  { text: 'The only thing you can do is keep moving forward. One step at a time.', author: 'Hajime no Ippo' },
  { text: 'A loss is not a defeat if you learn something from it.', author: 'Hajime no Ippo' },
  { text: 'You don\'t become strong because you win. You win because you\'re strong — and you become strong through hard work.', author: 'Hajime no Ippo' },
  { text: 'The moment you give up is the moment you lose.', author: 'Hajime no Ippo' },
  // === Haikyuu!! ===
  { text: 'Talent is something you bloom. Instinct is something you polish.', author: 'Haikyuu!!' },
  { text: 'The view from the top is the best.', author: 'Haikyuu!!' },
  { text: 'To be born with talent is one thing. To work hard to develop it is another.', author: 'Haikyuu!!' },
  { text: 'If you\'re going to hit, hit until it breaks.', author: 'Haikyuu!!' },
  // === General Anime ===
  { text: 'People can\'t live alone. We need each other.', author: 'Anime' },
  { text: 'The world may be cruel, but it\'s also beautiful.', author: 'Anime' },
  { text: 'In this world, there are things that can only be achieved through pain.', author: 'Anime' },
  { text: 'Sometimes, the best way to move forward is to let go of the past.', author: 'Anime' },
  { text: 'A person\'s true strength is revealed in the face of adversity.', author: 'Anime' },
  { text: 'Don\'t be afraid of death. Be afraid of a life unlived.', author: 'Anime' },
  { text: 'Sometimes the strongest people are the ones who smile through the pain.', author: 'Anime' },
  { text: 'The only person who can defeat you is yourself.', author: 'Anime' },
  // === Naval Ravikant ===
  { text: 'If you can\'t decide, the answer is no.', author: 'Naval Ravikant' },
  { text: 'The purpose of life is to find your purpose. The meaning of life is to give it away.', author: 'Naval Ravikant' },
  { text: 'Desire is a contract you make with yourself to be unhappy until you get what you want.', author: 'Naval Ravikant' },
  { text: 'Read what you love until you love to read.', author: 'Naval Ravikant' },
  { text: 'The most important skill for getting rich is being a perpetual learner.', author: 'Naval Ravikant' },
  { text: 'All the benefits in life come from compound interest — in relationships, in health, and in knowledge.', author: 'Naval Ravikant' },
  { text: 'Happiness is a skill. It requires effort and time.', author: 'Naval Ravikant' },
  { text: 'The more you know, the less you need.', author: 'Naval Ravikant' },
  // === Osho ===
  { text: 'The only way to be happy is to drop all expectations.', author: 'Osho' },
  { text: 'Intelligence is the door to freedom.', author: 'Osho' },
  { text: 'Don\'t seek, don\'t search, don\'t ask, don\'t knock — just relax.', author: 'Osho' },
  { text: 'Courage is the greatest religious quality.', author: 'Osho' },
  { text: 'To be creative means to be in love with life.', author: 'Osho' },
  { text: 'A man of awareness is always free.', author: 'Osho' },
  { text: 'Life is a mystery to be lived, not a problem to be solved.', author: 'Osho' },
  // === Marcus Aurelius (Stoic) ===
  { text: 'The happiness of your life depends upon the quality of your thoughts.', author: 'Marcus Aurelius' },
  { text: 'You have power over your mind — not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' },
  { text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius' },
  { text: 'The universe is change; our life is what our thoughts make it.', author: 'Marcus Aurelius' },
  { text: 'Very little is needed to make a happy life; it is all within yourself.', author: 'Marcus Aurelius' },
  { text: 'The best revenge is to be unlike him who performed the injury.', author: 'Marcus Aurelius' },
  { text: 'Accept the things to which fate binds you, and love the people with whom fate brings you together.', author: 'Marcus Aurelius' },
  // === Seneca ===
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca' },
  { text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
  { text: 'It is not that we have a short time to live, but that we waste a lot of it.', author: 'Seneca' },
  { text: 'Sometimes even to live is an act of courage.', author: 'Seneca' },
  { text: 'A man who suffers before it is necessary suffers more than necessary.', author: 'Seneca' },
  // === Epictetus ===
  { text: 'It\'s not what happens to you, but how you react to it that matters.', author: 'Epictetus' },
  { text: 'No man is free who is not master of himself.', author: 'Epictetus' },
  { text: 'Wealth consists not in having great possessions, but in having few wants.', author: 'Epictetus' },
  { text: 'First say to yourself what you would be; then do what you have to do.', author: 'Epictetus' },
  // === F. Scott Fitzgerald ===
  { text: 'So we beat on, boats against the current, borne back ceaselessly into the past.', author: 'F. Scott Fitzgerald' },
  { text: 'The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time.', author: 'F. Scott Fitzgerald' },
  { text: 'Show me a hero and I\'ll write you a tragedy.', author: 'F. Scott Fitzgerald' },
  { text: 'There are all kinds of love in this world, but never the same love twice.', author: 'F. Scott Fitzgerald' },
  // === Ernest Hemingway ===
  { text: 'The world breaks everyone, and afterward, some are strong at the broken places.', author: 'Ernest Hemingway' },
  { text: 'The best people possess a feeling for beauty, the courage to take risks, the discipline to tell the truth.', author: 'Ernest Hemingway' },
  { text: 'A man can be destroyed but not defeated.', author: 'Ernest Hemingway' },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway' },
  { text: 'Courage is grace under pressure.', author: 'Ernest Hemingway' },
  // === George Orwell ===
  { text: 'In a time of deceit telling the truth is a revolutionary act.', author: 'George Orwell' },
  { text: 'Big Brother is watching you.', author: 'George Orwell' },
  { text: 'War is peace. Freedom is slavery. Ignorance is strength.', author: 'George Orwell' },
  { text: 'The freedom to be your best self is the only freedom worth having.', author: 'George Orwell' },
  // === Oscar Wilde ===
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
  { text: 'We are all in the gutter, but some of us are looking at the stars.', author: 'Oscar Wilde' },
  { text: 'Experience is simply the name we give our mistakes.', author: 'Oscar Wilde' },
  { text: 'To live is the rarest thing in the world. Most people exist, that is all.', author: 'Oscar Wilde' },
  // === Mark Twain ===
  { text: 'The two most important days in your life are the day you are born and the day you find out why.', author: 'Mark Twain' },
  { text: 'Never let the fear of striking out keep you from playing the game.', author: 'Mark Twain' },
  { text: 'If you tell the truth, you don\'t have to remember anything.', author: 'Mark Twain' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  // === George Bernard Shaw ===
  { text: 'Progress is impossible without change, and those who cannot change their minds cannot change anything.', author: 'George Bernard Shaw' },
  { text: 'Life isn\'t about finding yourself. Life is about creating yourself.', author: 'George Bernard Shaw' },
  { text: 'We don\'t stop playing because we grow old; we grow old because we stop playing.', author: 'George Bernard Shaw' },
  // === Carl Jung ===
  { text: 'I am not what happened to me. I am what I choose to become.', author: 'Carl Jung' },
  { text: 'Who looks outside, dreams; who looks inside, awakes.', author: 'Carl Jung' },
  { text: 'The privilege of a lifetime is to become who you truly are.', author: 'Carl Jung' },
  { text: 'Your visions will become clear only when you can look into your own heart.', author: 'Carl Jung' },
  // === Victor Frankl ===
  { text: 'Between stimulus and response there is a space. In that space is our power to choose our response.', author: 'Viktor Frankl' },
  { text: 'When we are no longer able to change a situation, we are challenged to change ourselves.', author: 'Viktor Frankl' },
  { text: 'Those who have a \'why\' to live can bear almost any \'how\'.', author: 'Viktor Frankl' },
  // === Lao Tzu ===
  { text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'Knowing others is intelligence; knowing yourself is true wisdom.', author: 'Lao Tzu' },
  { text: 'When I let go of what I am, I become what I might be.', author: 'Lao Tzu' },
  { text: 'Water is soft and yielding, yet it wears down stone.', author: 'Lao Tzu' },
  // === J.R.R. Tolkien ===
  { text: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien' },
  { text: 'All we have to decide is what to do with the time that is given us.', author: 'J.R.R. Tolkien' },
  { text: 'Even the smallest person can change the course of the future.', author: 'J.R.R. Tolkien' },
  { text: 'The Road goes ever on and on.', author: 'J.R.R. Tolkien' },
  // === C.S. Lewis ===
  { text: 'You are never too old to set another goal or to dream a new dream.', author: 'C.S. Lewis' },
  { text: 'Integrity is doing the right thing, even when no one is watching.', author: 'C.S. Lewis' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis' },
  // === Bruce Lee ===
  { text: 'Be water, my friend.', author: 'Bruce Lee' },
  { text: 'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.', author: 'Bruce Lee' },
  { text: 'The successful warrior is the average man, with laser-like focus.', author: 'Bruce Lee' },
  { text: 'Do not pray for an easy life, pray for the strength to endure a difficult one.', author: 'Bruce Lee' },
  // === Jiddu Krishnamurti ===
  { text: 'Freedom is not the capacity to do what you want, but the capacity to choose what is right.', author: 'Jiddu Krishnamurti' },
  { text: 'The ability to observe without evaluating is the highest form of intelligence.', author: 'Jiddu Krishnamurti' },
  { text: 'It is no measure of health to be well adjusted to a profoundly sick society.', author: 'Jiddu Krishnamurti' },
  // === Khalil Gibran ===
  { text: 'Your pain is the breaking of the shell that encloses your understanding.', author: 'Khalil Gibran' },
  { text: 'The deeper that sorrow carves into your being, the more joy you can contain.', author: 'Khalil Gibran' },
  { text: 'Forget not that the earth delights to feel your bare feet.', author: 'Khalil Gibran' },
  // === Hindi Proverbs & Wisdom ===
  { text: 'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।', author: 'Sanskrit Proverb' },
  { text: 'सत्यमेव जयते नानृतम्।', author: 'Mundaka Upanishad' },
  { text: 'अहिंसा परमो धर्मः।', author: 'Mahabharata' },
  { text: 'जो तू डालूँगा वही कटेगा, जो तू बोएगा वही उगेगा।', author: 'Hindi Proverb' },
  { text: 'समय सबका बलवान होता है।', author: 'Hindi Proverb' },
  { text: 'थोड़ा धैर्य, थोड़ा प्रयास, और सब कुछ बदल जाता है।', author: 'Hindi Proverb' },
  { text: 'जैसा खाए अन्न वैसा होए मन।', author: 'Hindi Proverb' },
  { text: 'करत-करत अभ्यास के जड़मति होत सुजान।', author: 'Hindi Proverb' },
  { text: 'रात का अँधेरा कितना भी गहरा हो, सुबह हमेशा आती है।', author: 'Hindi Proverb' },
  { text: 'हौसला मत छोड़ो, मंज़िल दूर नहीं।', author: 'Hindi Proverb' },
  // === More Hindi Quotes ===
  { text: 'सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।', author: 'Hindi Proverb' },
  { text: 'जीवन में सबसे बड़ा साहस यह है कि तुम अपने मन की सुनो।', author: 'Hindi Proverb' },
  { text: 'गलतियाँ ही इंसान को सिखाती हैं, सही तो बस मंज़िल दिखाता है।', author: 'Hindi Proverb' },
  { text: 'हर मुश्किल में एक आसानी छिपी होती है।', author: 'Hindi Proverb' },
  { text: 'जो हो गया वह बीत गया, आगे की सोचो।', author: 'Hindi Proverb' },
  // === More Japanese Wisdom ===
  { text: 'Fall down seven times, stand up eight.', author: 'Japanese Proverb' },
  { text: 'The bamboo that bends is stronger than the oak that resists.', author: 'Japanese Proverb' },
  { text: 'A frog in a well does not know the great ocean.', author: 'Japanese Proverb' },
  { text: 'Vision without action is a daydream. Action without vision is a nightmare.', author: 'Japanese Proverb' },
  // === More Sanskrit ===
  { text: 'आरम्भः सफलता की कुंजी है।', author: 'Sanskrit' },
  { text: 'धैर्यं सर्वसुखप्रदम्।', author: 'Sanskrit' },
  { text: 'विद्या ददाति विनयम्।', author: 'Sanskrit' },
  { text: 'योगः कर्मसु कौशलम्।', author: 'Bhagavad Gita' },
  { text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।', author: 'Bhagavad Gita' },
  // === More General Literature ===
  { text: 'We are all broken, that\'s how the light gets in.', author: 'Ernest Hemingway' },
  { text: 'It is never too late to be what you might have been.', author: 'George Eliot' },
  { text: 'What is written without effort is in general read without pleasure.', author: 'Samuel Johnson' },
  { text: 'The scariest moment is always just before you start.', author: 'Stephen King' },
  { text: 'I have never let my schooling interfere with my education.', author: 'Mark Twain' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Life shrinks or expands in proportion to one\'s courage.', author: 'Anaïs Nin' },
  { text: 'Nothing is impossible, the word itself says \'I\'m possible\'!', author: 'Audrey Hepburn' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
  { text: 'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.', author: 'Ralph Waldo Emerson' },
  // === Short & Powerful ===
  { text: 'This too shall pass.', author: 'Persian Proverb' },
  { text: 'Carpe diem.', author: 'Horace' },
  { text: 'Memento mori.', author: 'Latin Proverb' },
  { text: 'Acta non verba.', author: 'Latin Proverb' },
  { text: 'Veni, vidi, vici.', author: 'Julius Caesar' },
  { text: 'Per aspera ad astra.', author: 'Latin Proverb' },
  { text: 'Fortune favors the bold.', author: 'Virgil' },
  { text: 'Know thyself.', author: 'Socrates' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates' },
  { text: 'I think, therefore I am.', author: 'René Descartes' },
  // === More Philosophers ===
  { text: 'Man is condemned to be free.', author: 'Jean-Paul Sartre' },
  { text: 'Hell is other people.', author: 'Jean-Paul Sartre' },
  { text: 'Life begins on the other side of despair.', author: 'Jean-Paul Sartre' },
  { text: 'One cannot step twice in the same river.', author: 'Heraclitus' },
  { text: 'The only constant in life is change.', author: 'Heraclitus' },
  { text: 'A room without books is like a body without a soul.', author: 'Cicero' },
  { text: 'It is better to be feared than loved, if you cannot be both.', author: 'Niccolò Machiavelli' },
  { text: 'The ends justify the means.', author: 'Niccolò Machiavelli' },
  { text: 'I came, I saw, I conquered.', author: 'Julius Caesar' },
  { text: 'There is no love without solitude.', author: 'Pablo Neruda' },
  // === More Hindi/Urdu Poets ===
  { text: 'हर एक ज़र्रे में समाया है वो, आसमाँ से भी ऊँचा है वो।', author: 'Hindi Poet' },
  { text: 'चलते रहो, चलते रहो — मंज़िल मिले न मिले, चलते रहो।', author: 'Hindi Poet' },
  { text: 'दिल में उतर जाने वाली बातें ही असर छोड़ती हैं।', author: 'Hindi Poet' },
  { text: 'लोग कहते हैं दर्द बाँटने से कम होता है, पर मैं कहता हूँ दर्द बाँटने से दूना होता है।', author: 'Hindi Poet' },
  { text: 'हम वही हैं जो अपने दर्द को भी मुस्कान में बदल देते हैं।', author: 'Hindi Proverb' },
  // === More Anime ===
  { text: 'I don\'t want to die without leaving anything behind. I want to be remembered.', author: 'Anime' },
  { text: 'Even in the darkness, there\'s always a light that guides us.', author: 'Anime' },
  { text: 'The past is a memory, the future is a dream, but the present is real.', author: 'Anime' },
  { text: 'Don\'t let fear stop you from moving forward.', author: 'Anime' },
  { text: 'A hero is not the one who never falls, but the one who gets up again.', author: 'Anime' },
  { text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Anime' },
  { text: 'When you hit rock bottom, the only way left is up.', author: 'Anime' },
  { text: 'Every moment in life is a learning experience.', author: 'Anime' },
  { text: 'The bonds we share are stronger than any weapon.', author: 'Anime' },
  { text: 'Sometimes the heart sees what is invisible to the eye.', author: 'Anime' },
  // === Mahadevi Verma ===
  { text: 'हमें जीवन में कुछ पाना है तो कुछ खोना भी होगा।', author: 'Mahadevi Verma' },
  { text: 'दर्द कोई ऐसा बोझ नहीं जो उठाया न जा सके।', author: 'Mahadevi Verma' },
  { text: 'जब तक साँस है, तब तक आशा है।', author: 'Mahadevi Verma' },
  { text: 'सपनों का सच होना ही जीवन का सत्य है।', author: 'Mahadevi Verma' },
  { text: 'दुख की आँखों से जीवन को देखो तो जीवन दुखमय है, सुख की आँखों से देखो तो जीवन सुखमय है।', author: 'Mahadevi Verma' },
  { text: 'मैं अकेली हूँ — और यही मेरी ताकत है।', author: 'Mahadevi Verma' },
  // === Jaishankar Prasad ===
  { text: 'हिमालय के आँगन में उसे प्रथम किरणों का दान दो।', author: 'Jaishankar Prasad' },
  { text: 'अमर राष्ट्र की यह अमर कहानी, सुनो इसे तुम सब महान।', author: 'Jaishankar Prasad' },
  { text: 'मानव जीवन की सबसे बड़ी विडंबना यह है कि वह अपने सुख के लिए दूसरों के दुख को भूल जाता है।', author: 'Jaishankar Prasad' },
  { text: 'सत्य की जीत होती है, असत्य का नाश।', author: 'Jaishankar Prasad' },
  // === Suryakant Tripathi Nirala ===
  { text: 'जागो फिर एक बार।', author: 'Suryakant Tripathi Nirala' },
  { text: 'अनगढ़ पत्थर की मूरत में भी भगवान हो सकता है।', author: 'Suryakant Tripathi Nirala' },
  { text: 'हार नहीं मानूँगा, रार नहीं ठानूँगा।', author: 'Suryakant Tripathi Nirala' },
  { text: 'जीवन में उजास लाने के लिए अंधकार से लड़ना होता है।', author: 'Suryakant Tripathi Nirala' },
  // === Dharamvir Bharti ===
  { text: 'गुनाहों का देवता है — तुम हर गुनाह से ऊपर उठ सकते हो।', author: 'Dharamvir Bharti' },
  { text: 'प्यार में सब कुछ खोने का दुख नहीं होता, दुख तब होता है जब प्यार में कुछ बच जाता है।', author: 'Dharamvir Bharti' },
  { text: 'जिंदगी को जीना सीखो, क्योंकि एक बार जीने के बाद यह वापस नहीं आती।', author: 'Dharamvir Bharti' },
  { text: 'सच्चा प्यार वही है जो किसी से कुछ नहीं माँगता, बस सब कुछ दे देता है।', author: 'Dharamvir Bharti' },
  // === Agyeya (Sachchidananda Vatsyayan) ===
  { text: 'नदी के दो किनारों की तरह हैं हम — पास होकर भी दूर।', author: 'Agyeya' },
  { text: 'मैं जितना भी टूटा, उतना ही जुड़ा।', author: 'Agyeya' },
  { text: 'सृजन का क्षण सबसे सुंदर होता है।', author: 'Agyeya' },
  { text: 'अकेलापन एक ऐसा सच है जिसे कोई झूठ नहीं कर सकता।', author: 'Agyeya' },
  // === Amrita Pritam ===
  { text: 'कहते हैं कि आदमी की पहचान उसके कर्मों से होती है, मगर कभी-कभी उसकी पहचान उसकी चुप्पी से भी होती है।', author: 'Amrita Pritam' },
  { text: 'अजनबी से मिलने का मतलब है, खुद से मिलना।', author: 'Amrita Pritam' },
  { text: 'हर रिश्ते की एक कीमत होती है — कभी वह प्यार से चुकाई जाती है, कभी दर्द से।', author: 'Amrita Pritam' },
  { text: 'मैं तुम्हें फिर मिलूँगी कहाँ, कैसे, पता नहीं।', author: 'Amrita Pritam' },
  { text: 'यह सच है कि मैंने तुमसे प्यार किया, लेकिन यह भी सच है कि मैंने खुद से भी प्यार किया।', author: 'Amrita Pritam' },
  { text: 'सबसे बड़ा सत्य यह है कि मनुष्य को मनुष्य से प्यार करना आना चाहिए।', author: 'Amrita Pritam' },
  // === Gulzar ===
  { text: 'हर रिश्ते में थोड़ी बारिश ज़रूरी होती है — नहीं तो उसकी रूह सूख जाती है।', author: 'Gulzar' },
  { text: 'दिल में एक समंदर है, जो कभी सूखता नहीं।', author: 'Gulzar' },
  { text: 'बीती हुई बातों से तो शिकायत नहीं करनी चाहिए, उनसे सीख लेनी चाहिए।', author: 'Gulzar' },
  { text: 'रिश्तों की गहराई कोई माप नहीं सकता, उसे सिर्फ महसूस किया जा सकता है।', author: 'Gulzar' },
  { text: 'जिंदगी में कुछ लोग ऐसे आते हैं जो सिखा कर जाते हैं कि कैसे जीना चाहिए।', author: 'Gulzar' },
  { text: 'वक़्त की रफ़्तार को रोका नहीं जा सकता, लेकिन उसकी यादों को संजोया जा सकता है।', author: 'Gulzar' },
  // === Saadat Hasan Manto ===
  { text: 'इंसानियत सबसे बड़ा धर्म है।', author: 'Saadat Hasan Manto' },
  { text: 'दुनिया में सबसे बड़ा सच यह है कि कोई सच नहीं है।', author: 'Saadat Hasan Manto' },
  { text: 'आज़ादी का मतलब सिर्फ झंडा लहराना नहीं, बल्कि अपनी सोच को आज़ाद करना है।', author: 'Saadat Hasan Manto' },
  { text: 'इंसान को इंसान से अलग करने वाली दीवारें सबसे खतरनाक होती हैं।', author: 'Saadat Hasan Manto' },
  { text: 'एक इंसान दूसरे इंसान के लिए कितना कुछ कर सकता है, यह मैंने विभाजन के दिनों में देखा।', author: 'Saadat Hasan Manto' },
  // === Bhisham Sahni ===
  { text: 'जीवन का सबसे बड़ा पाठ यह है कि हमें कभी हार नहीं माननी चाहिए।', author: 'Bhisham Sahni' },
  { text: 'संघर्ष ही जीवन है, और जीवन ही संघर्ष।', author: 'Bhisham Sahni' },
  { text: 'अपने आप पर विश्वास रखो, तभी तुम दुनिया से लड़ सकते हो।', author: 'Bhisham Sahni' },
  { text: 'मनुष्य अपने कर्मों से महान होता है, जन्म से नहीं।', author: 'Bhisham Sahni' },
  { text: 'हर मुश्किल के बाद एक आसानी आती है — यही जीवन का नियम है।', author: 'Bhisham Sahni' },
  // === Ismat Chughtai ===
  { text: 'औरत को अपनी आज़ादी खुद कमानी होती है।', author: 'Ismat Chughtai' },
  { text: 'सच्चाई को कभी दबाया नहीं जा सकता, वह एक न एक दिन बाहर आ ही जाती है।', author: 'Ismat Chughtai' },
  { text: 'जो लिखा जाता है, वह कभी मरता नहीं।', author: 'Ismat Chughtai' },
  { text: 'बिना संघर्ष के कोई भी चीज़ हासिल नहीं होती।', author: 'Ismat Chughtai' },
  // === Rahi Masoom Raza ===
  { text: 'आदमी को अपनी औकात में रहना चाहिए, मगर सपने तो आज़ाद हैं।', author: 'Rahi Masoom Raza' },
  { text: 'मोहब्बत की कोई उम्र नहीं होती, वह तो बस होती है।', author: 'Rahi Masoom Raza' },
  { text: 'जिंदगी एक किताब की तरह है — कभी हँसाती है, कभी रुलाती है।', author: 'Rahi Masoom Raza' },
  { text: 'लोग कहते हैं कि वक़्त बदलता है, मगर इंसान नहीं बदलता।', author: 'Rahi Masoom Raza' },
  // === Mohan Rakesh ===
  { text: 'आदमी को आदमी से मिलना चाहिए, और मिलकर कुछ बाँटना चाहिए।', author: 'Mohan Rakesh' },
  { text: 'हर रिश्ते की अपनी एक भाषा होती है।', author: 'Mohan Rakesh' },
  { text: 'आदमी अकेला आता है और अकेला जाता है, बीच के सफर को वह दूसरों के साथ बाँट लेता है।', author: 'Mohan Rakesh' },
  // === Nirmal Verma ===
  { text: 'अकेलेपन की अपनी एक आवाज़ होती है, जो सुनाई नहीं देती, सिर्फ महसूस की जा सकती है।', author: 'Nirmal Verma' },
  { text: 'यादें ही इंसान की असली पहचान होती हैं।', author: 'Nirmal Verma' },
  { text: 'रिश्ते वैसे नहीं होते जैसे हम चाहते हैं, वे वैसे होते हैं जैसे उन्हें होना चाहिए।', author: 'Nirmal Verma' },
  // === Phanishwar Nath Renu ===
  { text: 'गाँव की मिट्टी में एक अलग ही खुशबू होती है — जो शहर की चकाचौंध में कहीं खो जाती है।', author: 'Phanishwar Nath Renu' },
  { text: 'जीवन के सच्चे सुख छोटी-छोटी चीज़ों में हैं।', author: 'Phanishwar Nath Renu' },
  { text: 'मिट्टी से जुड़ा रहो, वही तुम्हारी असली पहचान है।', author: 'Phanishwar Nath Renu' },
  // === Ramdhari Singh Dinkar ===
  { text: 'क्षमा शोभती उस भुजंग को, जिसके पास गरल हो।', author: 'Ramdhari Singh Dinkar' },
  { text: 'सिंहासन खाली करो कि जनता आती है।', author: 'Ramdhari Singh Dinkar' },
  { text: 'जहाँ न पहुँचे रवि, वहाँ पहुँचे कवि।', author: 'Ramdhari Singh Dinkar' },
  { text: 'हिंदी की जय, हिंदुस्तान की जय।', author: 'Ramdhari Singh Dinkar' },
  // === Maithilisharan Gupt ===
  { text: 'जिस देश में गंगा बहती है, वह देश धन्य है।', author: 'Maithilisharan Gupt' },
  { text: 'जो भरा नहीं है भावों से, बहती जिसमें रसधार नहीं, वह हृदय नहीं, पत्थर है।', author: 'Maithilisharan Gupt' },
  { text: 'सच्ची आज़ादी का अर्थ है — अपने कर्तव्यों को समझना।', author: 'Maithilisharan Gupt' },
  // === Shivani (Gaura Pant) ===
  { text: 'एक माँ का प्यार ही सबसे बड़ा प्यार होता है।', author: 'Shivani' },
  { text: 'संस्कार ही इंसान की असली पूंजी हैं।', author: 'Shivani' },
  { text: 'जीवन में छोटी-छोटी खुशियाँ ही बड़ी चीज़ें होती हैं।', author: 'Shivani' },
  // === Hazari Prasad Dwivedi ===
  { text: 'बिना विद्या के मनुष्य पशु के समान है।', author: 'Hazari Prasad Dwivedi' },
  { text: 'ज्ञान ही एकमात्र ऐसा धन है जो चुराया नहीं जा सकता।', author: 'Hazari Prasad Dwivedi' },
  { text: 'सच्चा आनंद ज्ञान में है, भोग में नहीं।', author: 'Hazari Prasad Dwivedi' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const habitIcons: Record<string, React.ReactNode> = {
  Coding: <Code size={14} />,
  Reading: <BookOpen size={14} />,
  Workout: <Dumbbell size={14} />,
  Meditation: <Heart size={14} />,
  'Water Intake': <Droplet size={14} />,
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const slideUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};
const slideRight = {
  hidden: { opacity: 0, x: 14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getTodayDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function Dashboard() {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const tasks = useLifeStore(s => s.tasks);
  const goals = useLifeStore(s => s.goals);
  const habits = useLifeStore(s => s.habits);
  const projects = useLifeStore(s => s.projects);
  const learningPaths = useLifeStore(s => s.learningPaths);
  const updateTask = useLifeStore(s => s.updateTask);
  const expenses = useLifeStore(s => s.expenses);
  const loans = useLifeStore(s => s.loans);

  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const done = tasks.filter(t => t.status === 'done').length;
  const pending = tasks.filter(t => t.status !== 'done').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let monthEarnings = 0;
  let monthExpenses = 0;
  for (const t of expenses) {
    if (!t.date.startsWith(monthPrefix)) continue;
    const amt = Number(t.amount);
    if (t.type === 'income') monthEarnings += amt;
    else monthExpenses += amt;
  }
  let loanNet = 0;
  for (const l of loans) {
    const outstanding = Math.max(0, Number(l.principal) - Number(l.paid));
    loanNet += l.kind === 'borrowed' ? -outstanding : outstanding;
  }
  const monthSavings = monthEarnings - monthExpenses;
  const finance = {
    earnings: monthEarnings,
    expenses: monthExpenses,
    savings: monthSavings,
    rate: monthEarnings > 0 ? Math.round((monthSavings / monthEarnings) * 100) : 0,
    loanNet,
  };

  const topTasks = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      const order = ['urgent', 'high', 'medium', 'low'];
      return order.indexOf(a.priority) - order.indexOf(b.priority);
    })
    .slice(0, 5);

  const weeklyData = DAYS.map(d => {
    const dayTasks = tasks.filter(t => DAYS[new Date(t.dueDate).getDay()] === d);
    return { day: d, tasks: dayTasks.length, completed: dayTasks.filter(t => t.status === 'done').length };
  });
  const maxWeeklyTasks = Math.max(...weeklyData.map(d => d.tasks), 1);

  const trendData = DAYS.map(d => {
    const dayTasks = tasks.filter(t => DAYS[new Date(t.dueDate).getDay()] === d);
    return { day: d, hours: dayTasks.reduce((sum, t) => sum + (t.status === 'done' ? 2.5 : 1), 0) };
  });
  const maxHours = Math.max(...trendData.map(d => d.hours), 1);
  const svgW = 120;
  const svgH = 32;
  const trendPoints = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * svgW;
    const y = svgH - (d.hours / maxHours) * svgH;
    return `${x},${y}`;
  }).join(' ');
  const trendArea = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * svgW;
    const y = svgH - (d.hours / maxHours) * svgH;
    return `${x},${y}`;
  }).join(' ') + ` ${svgW},${svgH} 0,${svgH}`;

  const goalCategories = ['long-term', 'medium-term', 'short-term'] as const;
  const categoryCounts = goalCategories.map(cat => ({
    label: cat.replace('-', ' '),
    count: goals.filter(g => g.category === cat).length,
    color: cat === 'long-term' ? '#B8D8F8' : cat === 'medium-term' ? '#F7E8A4' : '#CDEAC0',
  }));

  return (
    <div className="space-y-8 relative">
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#2D2D2D 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A2A2A]">{getGreeting()}</h1>
          <p className="text-[#5C5C5C] font-medium mt-0.5">{getTodayDate()}</p>
        </div>
        {mounted && quote && (
          <div className="flex items-start gap-3 p-3 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] max-w-sm">
            <Sparkles size={16} className="text-[#F7E8A4] flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-[#5C5C5C] italic leading-relaxed">
              &ldquo;{quote.text}&rdquo; <span className="not-italic font-bold">— {quote.author}</span>
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.06, ease: 'easeOut' }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="neo-card p-4 flex items-center gap-3" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #CDEAC0' }}>
          <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#CDEAC0' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Tasks Done</p>
            <p className="text-xl font-extrabold">{mounted ? done : '—'}</p>
          </div>
        </div>
        <div className="neo-card p-4 flex items-center gap-3" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #F7E8A4' }}>
          <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F7E8A4' }}>
            <Target size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Active Goals</p>
            <p className="text-xl font-extrabold">{mounted ? goals.length : '—'}</p>
          </div>
        </div>
        <div className="neo-card p-4 flex items-center gap-3" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #F8C8C8' }}>
          <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F8C8C8' }}>
            <Flame size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Best Streak</p>
            <p className="text-xl font-extrabold">{mounted ? bestStreak : '—'}</p>
          </div>
        </div>
        <div className="neo-card p-4" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #B8D8F8' }}>
          <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Completion</p>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 36 36" className="w-11 h-11 flex-shrink-0">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F0ECE4" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#B8D8F8" strokeWidth="3" strokeDasharray={`${mounted ? completionRate : 0}, 100`} strokeLinecap="round" />
            </svg>
            <span className="text-xl font-extrabold">{mounted ? `${completionRate}%` : '—%'}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
      >
        <NeoCard color="#F7E8A4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] flex items-center justify-center"><Wallet size={18} /></div>
              <h2 className="text-lg font-extrabold">Finance · {now.toLocaleDateString('en-US', { month: 'long' })}</h2>
            </div>
            <Button onClick={() => router.push('/expenses')} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1">
              Open Finance <ArrowRight size={12} />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-green">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><TrendingUp size={12} /> Earnings</p>
              <p className="text-xl font-extrabold mt-1">{mounted ? moneyShort(finance.earnings) : '—'}</p>
            </div>
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-pink">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><TrendingDown size={12} /> Expenses</p>
              <p className="text-xl font-extrabold mt-1">{mounted ? moneyShort(finance.expenses) : '—'}</p>
            </div>
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-yellow">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><PiggyBank size={12} /> Savings</p>
              <p className={`text-xl font-extrabold mt-1 ${finance.savings >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
                {mounted ? moneyShort(finance.savings) : '—'}
                <span className="text-xs font-bold text-[#5C5C5C]"> · {finance.rate}%</span>
              </p>
            </div>
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-blue">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><HandCoins size={12} /> Loans</p>
              <p className={`text-xl font-extrabold mt-1 ${finance.loanNet >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
                {mounted ? moneyShort(finance.loanNet) : '—'}
              </p>
            </div>
          </div>
        </NeoCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NeoCard color="#B8D8F8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#B8D8F8] flex items-center justify-center"><ListChecks size={18} /></div>
                <h2 className="text-lg font-extrabold">Focus Today</h2>
              </div>
               <Button onClick={() => router.push('/tasks')} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1">
                 All Tasks <ArrowRight size={12} />
               </Button>
            </div>
            {mounted && topTasks.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
                {topTasks.map(task => (
                  <motion.div key={task.id} variants={slideLeft}
                    className="flex items-center gap-3 p-3 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] hover:bg-[#F0ECE4] cursor-pointer transition-colors"
                    onClick={() => updateTask(task.id, { status: 'done' })}
                  >
                    <div className="w-5 h-5 rounded-md border-[2px] border-[#2D2D2D] flex-shrink-0 hover:bg-[#CDEAC0] transition-colors" />
                    <span className="text-sm font-medium flex-1">{task.title}</span>
                    {task.dueDate && (
                      <span className="text-xs font-bold text-[#5C5C5C]">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border-[2px] border-[#2D2D2D] ${task.priority === 'urgent' ? 'bg-[#F8C8C8]' : task.priority === 'high' ? 'bg-[#FFD8BE]' : 'bg-[#F7E8A4]'}`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : mounted && topTasks.length === 0 ? (
              <p className="text-sm text-[#5C5C5C] font-medium text-center py-8">All tasks completed!</p>
            ) : null}
          </NeoCard>

          <NeoCard color="#CDEAC0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#CDEAC0] flex items-center justify-center"><Trophy size={18} /></div>
                <h2 className="text-lg font-extrabold">Goal Progress</h2>
              </div>
               <Button onClick={() => router.push('/goals')} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1">
                 View All <ArrowRight size={12} />
               </Button>
            </div>
            {mounted && goals.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex flex-wrap items-center gap-2 mb-4"
              >
                {categoryCounts.filter(c => c.count > 0).map(c => (
                  <span key={c.label} className="text-xs font-bold px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: c.color }}>
                    {c.label} ({c.count})
                  </span>
                ))}
              </motion.div>
            )}
            {mounted && goals.slice(0, 4).length > 0 ? (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.slice(0, 4).map(g => (
                  <motion.div key={g.id} variants={slideUp} className="p-4 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: g.color }} />
                      <span className="text-xs font-bold truncate">{g.title}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#5C5C5C] uppercase">{g.category.replace('-', ' ')}</span>
                      <span className="text-sm font-extrabold">{g.progress}%</span>
                    </div>
                    <ProgressBar value={g.progress} color={g.color} height={8} showLabel={false} />
                    <span className="text-xs font-medium text-[#5C5C5C] mt-2 block">
                      {g.milestones.filter(m => m.completed).length}/{g.milestones.length} milestones
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : mounted && goals.length === 0 ? (
              <div className="col-span-2 text-center py-8"><p className="text-sm text-[#5C5C5C] font-medium">No goals yet.</p></div>
            ) : null}
          </NeoCard>

          <NeoCard color="#DCCEF5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#DCCEF5] flex items-center justify-center"><Rocket size={18} /></div>
                <h2 className="text-lg font-extrabold">Active Projects</h2>
              </div>
               <Button onClick={() => router.push('/projects')} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1">
                 View All <ArrowRight size={12} />
               </Button>
            </div>
            {mounted && projects.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                {projects.map(p => (
                  <motion.div key={p.id} variants={slideLeft} className="p-4 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.color }}>
                        <Rocket size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold truncate">{p.title}</h4>
                        <p className="text-xs font-medium text-[#5C5C5C] truncate">{p.description}</p>
                      </div>
                      <span className="text-sm font-extrabold">{p.progress}%</span>
                    </div>
                    <ProgressBar value={p.progress} color={p.color} height={8} showLabel={false} />
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs font-medium text-[#5C5C5C]">{p.milestones.filter(m => m.completed).length}/{p.milestones.length} milestones</span>
                      <span className="text-xs font-medium text-[#5C5C5C]">{p.tasks.length} tasks</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : mounted && projects.length === 0 ? (
              <p className="text-sm text-[#5C5C5C] font-medium text-center py-4">No active projects.</p>
            ) : null}
          </NeoCard>
        </div>

        <div className="space-y-6">
          <NeoCard color="#B8D8F8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#B8D8F8] flex items-center justify-center"><Activity size={18} /></div>
                <h3 className="text-sm font-extrabold">Weekly Activity</h3>
              </div>
              <motion.svg initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}
                viewBox={`0 0 ${svgW} ${svgH}`} className="w-20 h-6"
              >
                <polygon points={trendArea} fill="#B8D8F840" />
                <polyline points={trendPoints} fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-28 pt-4">
              {weeklyData.map(d => {
                const height = (d.tasks / maxWeeklyTasks) * 100;
                const completedHeight = (d.completed / d.tasks) * height;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <motion.div
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                      className="w-full relative rounded-md overflow-hidden origin-bottom"
                      style={{ height: `${height}%`, backgroundColor: '#F0ECE4' }}
                    >
                      <motion.div
                        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                        className="absolute bottom-0 w-full rounded-md origin-bottom"
                        style={{ height: `${completedHeight}%`, backgroundColor: '#B8D8F8' }}
                      />
                    </motion.div>
                    <span className="text-xs font-bold text-[#5C5C5C]">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-[#5C5C5C]">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#B8D8F8]" /> Done</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#F0ECE4]" /> Total</div>
            </div>
          </NeoCard>

          <NeoCard color="#F8C8C8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F8C8C8] flex items-center justify-center"><Flame size={18} /></div>
              <h3 className="text-sm font-extrabold">Habit Streaks</h3>
            </div>
            {mounted && habits.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-1.5">
                {habits.map(h => (
                  <motion.div key={h.id} variants={slideRight}
                    className="flex items-center justify-between p-2.5 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: h.color }}>
                        {habitIcons[h.name] || <Flame size={14} />}
                      </div>
                      <span className="text-xs font-bold">{h.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame size={14} className="text-[#F8C8C8]" />
                      <span className="text-sm font-extrabold">{h.streak}d</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : mounted && habits.length === 0 ? (
              <p className="text-xs text-[#5C5C5C] text-center py-4">No habits yet.</p>
            ) : null}
          </NeoCard>

          <NeoCard color="#FFD8BE">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFD8BE] flex items-center justify-center"><BookOpen size={18} /></div>
                <h3 className="text-sm font-extrabold">Learning</h3>
              </div>
               <Button onClick={() => router.push('/learning')} variant="outline" size="xs" className="text-muted-foreground">
                 View All
               </Button>
            </div>
            {mounted && learningPaths.slice(0, 3).length > 0 ? (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                {learningPaths.slice(0, 3).map(lp => (
                  <motion.div key={lp.id} variants={slideUp}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{lp.title}</span>
                      <span className="text-xs font-bold text-[#5C5C5C]">{lp.progress}%</span>
                    </div>
                    <ProgressBar value={lp.progress} color={lp.color} height={8} showLabel={false} />
                    <div className="flex gap-2 mt-1">
                      {lp.modules.filter(m => m.completed).length > 0 && (
                        <span className="text-xs font-medium text-[#5C5C5C]">{lp.modules.filter(m => m.completed).length}/{lp.modules.length} modules</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : mounted && learningPaths.length === 0 ? (
              <p className="text-xs text-[#5C5C5C] text-center py-4">No learning paths yet.</p>
            ) : null}
          </NeoCard>

          <NeoCard color="#F7E8A4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] flex items-center justify-center"><Layers size={18} /></div>
              <h3 className="text-sm font-extrabold">Quick Overview</h3>
            </div>
            {mounted ? (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
                {[
                  { label: 'Pending Tasks', value: pending, icon: ListChecks },
                  { label: 'Total Tasks', value: total, icon: Zap },
                  { label: 'Projects', value: projects.length, icon: Rocket },
                  { label: 'Learning Paths', value: learningPaths.length, icon: BookOpen },
                ].map((s, i) => (
                  <motion.div key={i} variants={slideRight}
                    className="flex items-center justify-between p-2.5 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
                  >
                    <div className="flex items-center gap-2">
                      <s.icon size={14} />
                      <span className="text-xs font-bold text-[#5C5C5C]">{s.label}</span>
                    </div>
                    <span className="text-sm font-extrabold">{s.value}</span>
                  </motion.div>
                ))}
                {goals.length > 0 && (
                  <motion.div variants={slideRight}
                    className="flex items-center gap-2 p-2.5 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
                  >
                    <Target size={14} />
                    <span className="text-xs font-bold text-[#5C5C5C]">Goal Split</span>
                    <div className="flex gap-0.5 ml-auto">
                      {categoryCounts.filter(c => c.count > 0).map(c => (
                        <span key={c.label} className="text-xs font-bold px-1.5 py-0.5 rounded border-[1.5px] border-[#2D2D2D]" style={{ backgroundColor: c.color }}>
                          {c.count}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : null}
          </NeoCard>
        </div>
      </div>
    </div>
  );
}
