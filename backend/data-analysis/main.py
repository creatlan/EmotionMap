import json
import random
from datetime import datetime, timedelta

WORDS = {
    "sadness": [
        "lonely heart", "deep sorrow", "tearful regret", "melancholy thoughts", "heavy-hearted",
        "blue mood", "wistful longing", "quiet sadness", "hollow pain", "silent despair",
        "broken dreams", "aching soul", "lost hope", "sorrowful tears", "mournful silence",
        "dejected spirit", "forlorn figure", "shadowy grief", "heartbreaking loss", "tragic end",
        "painful memory", "unfulfilled love", "dismal days", "regretful choices", "weeping shadow",
        "desolate path", "aching heart", "bitter goodbye", "remorseful sigh", "grieving soul",
        "hopeless night", "dark thoughts", "isolated mind", "nostalgic sorrow", "hidden tears",
        "bleak hours", "tear-streaked face", "mourning light", "quiet defeat", "despairing gaze",
        "shattered soul", "sinking feeling", "aching loneliness", "lost cause", "quiet mourning",
        "sorrowful glance", "desolate moment", "crying shadow", "gloomy heart", "tearful goodbye"
    ],
    "joy": [
        "happiness shines", "cheerful day", "smiling faces", "joyful heart", "ecstatic moments",
        "bright future", "gleeful laughter", "radiant joy", "thrilled soul", "euphoric mood",
        "sunny smile", "vibrant energy", "excited cheers", "overjoyed mind", "delighted spirit",
        "blissful harmony", "lively party", "cheerful vibe", "jubilation dance", "content mind",
        "upbeat rhythm", "warm glow", "magical day", "hopeful dawn", "positive thoughts",
        "colorful life", "giggles everywhere", "sparkling joy", "dancing feet", "lighthearted fun",
        "playful spirit", "amazing surprise", "exuberant moment", "wonderful time", "laughter echo",
        "shining eyes", "bright spark", "energetic leap", "joyful hug", "excited jump",
        "cheerful crowd", "gleeful clap", "smiling sun", "happy tears", "sunlit meadow",
        "thrilled group", "warm sunshine", "radiating happiness", "cheerful walk", "peaceful bliss"
    ],
    "love": [
        "eternal love", "devoted heart", "passionate embrace", "romantic evening", "sweet affection",
        "true devotion", "soulmate bond", "caring glance", "tender touch", "deep connection",
        "heartfelt smile", "cherished memory", "affectionate hug", "loving gaze", "warmth of love",
        "kindness overflow", "intimate moment", "darling whisper", "beloved partner", "romantic gesture",
        "sweetheart charm", "love spark", "unity forever", "harmony together", "fondness bloom",
        "adoring eyes", "compassionate care", "deep longing", "sweet desire", "gentle kiss",
        "eternal promise", "heartfelt sentiment", "affectionate bond", "passionate kiss", "romantic thrill",
        "tender passion", "soulful embrace", "unbreakable connection", "cherished affection", "belonging soul",
        "sparkling romance", "heartwarming touch", "intimate glance", "blissful love", "romantic dance",
        "caring warmth", "devotion eternal", "soulful love", "heartfelt devotion", "true affection"
    ],
    "fear": [
        "unseen terror", "horrified scream", "shaking hands", "paranoid thoughts", "dark fears",
        "goosebumps rise", "trembling voice", "haunted eyes", "dreadful night", "anxious heartbeat",
        "nervous glance", "helpless cry", "panic mode", "suspenseful scene", "spooky feeling",
        "alarming sound", "afraid shadow", "intense fright", "eerie silence", "unsettled gaze",
        "nerve-wracking", "fearful scream", "haunting memory", "threatening noise", "cautious step",
        "disturbed moment", "startled reaction", "chilling thought", "horrified expression", "panic-stricken mind",
        "terrorizing glance", "ominous sound", "vulnerable feeling", "frightening image", "alarmed heartbeat",
        "dreadful aura", "quivering lips", "spooked movement", "apprehensive mind", "nervous tension",
        "fearsome moment", "shaking figure", "helpless whisper", "paralyzed by fear", "haunted dreams",
        "creepy vibe", "terrified scream", "startling realization", "overwhelming fright", "nerve-shattering"
    ],
    "anger": [
        "furious outburst", "boiling rage", "annoyed glare", "bitter words", "wrathful wrath",
        "irritated tone", "heated argument", "angry shout", "fuming anger", "hostile feeling",
        "sharp retort", "resentful gaze", "frustrated sigh", "yelling loudly", "furious temper",
        "livid reaction", "antagonistic glare", "boiling over", "stormy mood", "rageful cry",
        "aggressive stance", "fiery moment", "intense fury", "burst of anger", "vengeful thought",
        "snapping temper", "dissatisfied tone", "outraged reaction", "offended glare", "venomous words",
        "sharp insult", "harsh tone", "dominating anger", "discontent look", "fiery eyes",
        "heated exchange", "angry protest", "frustrated complaint", "irritable response", "wrathful shout",
        "rage-filled moment", "dominating presence", "furious burst", "hostile behavior", "vengeful glare",
        "irritated words", "resentful protest", "fiery reaction", "angry mood", "harsh critique"
    ],
    "surprise": [
        "astonished words", "unexpected joy", "amazed expression", "shocked reaction", "bewildered smile",
        "flabbergasted laugh", "wide-eyed surprise", "incredible moment", "jaw-dropper", "marvelous sight",
        "unbelievable news", "spontaneous surprise", "quirky realization", "rare find", "serendipitous moment",
        "whimsical event", "bizarre occurrence", "outlandish twist", "peculiar discovery", "extraordinary day",
        "uncanny coincidence", "phenomenal experience", "startling discovery", "mystified glance", "jarring sound",
        "delightful moment", "amusing anecdote", "rare encounter", "random chance", "spontaneous laugh",
        "quirky behavior", "strange realization", "unusual situation", "wow factor", "unique perspective",
        "rare opportunity", "curious glance", "remarkable surprise", "astonishing event", "unexpected delight",
        "phenomenal outcome", "jarring change", "random joy", "serendipity struck", "unbelievable story",
        "peculiar feeling", "outlandish moment", "marvelous twist", "fantastic discovery", "amazing outcome"
    ]
}

def generate_coords(base_lat=55.7558, base_lng=37.6173, noise=0.1):
    return {
        "lat": base_lat + random.uniform(-noise, noise),
        "lng": base_lng + random.uniform(-noise, noise)
    }

def generate_data():
    data = []
    timestamp = datetime.now()
    for i in range(10):
        for label, words in WORDS.items():
            for word in words:
                point = {
                    "username": "admin",
                    "text": word,
                    "coords": generate_coords(),
                    "label": label,
                    "score": 1,
                    "timestamp": timestamp.isoformat()
                }
                data.append(point)
                timestamp += timedelta(seconds=1)
    return data

def save_to_file(data, filename="emotions_data.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    data = generate_data()
    save_to_file(data)
    print(f"Данные успешно сохранены в файл 'emotions_data.txt'")