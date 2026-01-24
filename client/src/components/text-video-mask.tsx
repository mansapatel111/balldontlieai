import { type CSSProperties } from "react"

interface TextVideoMaskProps {
  useVideoFile: boolean
  videoFile: string
  videoUrl: string
  text: string
  font: any
  textColor: string
  backgroundColor: string
  autoplay: boolean
  loop: boolean
  muted: boolean
  style?: CSSProperties
}

/**
 * Video mask component that uses text to mask a video with full text control
 */
export default function TextVideoMask(props: TextVideoMaskProps) {
  const {
    useVideoFile = true,
    videoFile = "/public/nfl.mov",
    videoUrl = "",
    text = "VIDEO",
    font,
    textColor = "#FFFFFF",
    backgroundColor = "#000000",
    autoplay = true,
    loop = true,
    muted = true,
  } = props

  const videoSource = useVideoFile ? videoFile : videoUrl

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <mask id="textMask">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={font?.fontSize || "120"}
              fontFamily={font?.fontFamily || "Inter"}
              fontWeight={font?.fontWeight || 700}
              fontStyle={font?.fontStyle || "normal"}
              letterSpacing={font?.letterSpacing || "-0.02em"}
            >
              {text.split(/\s+/).map((word, index, array) => {
                const lineHeight = parseFloat(
                  font?.lineHeight || "1.2"
                )
                const fontSize = parseFloat(
                  font?.fontSize || "120"
                )
                const totalHeight =
                  array.length * fontSize * lineHeight
                const startY =
                  300 - totalHeight / 2 + fontSize / 2
                return (
                  <tspan
                    key={index}
                    x="50%"
                    y={
                      startY +
                      index * fontSize * lineHeight
                    }
                  >
                    {word}
                  </tspan>
                )
              })}
            </text>
          </mask>
        </defs>
        <foreignObject width="100%" height="100%" mask="url(#textMask)">
          <video
            src={videoSource}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </foreignObject>
      </svg>
    </div>
  )
}
