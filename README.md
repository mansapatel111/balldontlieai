Youtube link: https://youtu.be/L5je9gYcXBM

Inspiration: 
Our inspiration came from struggling to enjoy sports as casual viewers. We felt like a lot of sports content assumes deep prior knowledge, which can make it hard to follow or enjoy. We thought sports would be much more fun to watch if they were explained in a way that felt humorous, relatable, and easy to understand.

What it does: 
Ball Don’t Lie is a website that takes in a YouTube sports clip and explains what’s happening in a simple, engaging way. Users can select a featured video and choose a mode of explanation, and the app generates a breakdown that translates the play into language anyone can understand. The explanation is then played as text-to-speech while the video streams, making sports more accessible and entertaining in real time.

How we built it: 
We built Ball Don’t Lie using a full-stack approach. The frontend was built with React and handles video selection and playback using the YouTube API. The backend uses Express to manage requests and communicate with a Python service. We used the Gemini API through OpenRouter to generate simplified explanations from video transcripts, and ElevenLabs for text-to-speech so users can listen to the explanation while watching the clip.

Challenges we ran into: 
One major challenge was integrating multiple APIs across different languages and environments. We also ran into challenges with environment variables across operating systems and handling API response timing so the audio and video felt synced.

Accomplishments that we're proud of: 
We’re proud that we successfully integrated AI-generated explanations with real video playback and text-to-speech. Despite the complexity of coordinating several services, we built a working end-to-end MVP that demonstrates how sports content can be made more inclusive and fun. We’re also proud of how well our team collaborated under time pressure.

What we learned: 
We learned how to generate AI voices through ElevenLabs and also how to use pivot when API's don't work and be resourceful.

What's next for Ball Don't Lie: 
We plan to add more voice options and distinct personalities, as well as improve audio generation latency for a smoother, more real-time experience.
