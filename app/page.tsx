"use client"

import Image from "next/image";
import { process } from "@/data/process";
import { tools } from "@/data/tools"
import { Timeline, TimelineEvent } from "@/components/ui/Timeline";
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Dither from "@/components/Dither";
import { bungee, saira } from "@/data/fonts";
import DirectionalReveal from "@/components/DirectionalReveal";
import AnimationViewer from "@/components/AnimationViewer";


export default function Home() {

  const data: TimelineEvent[] = process;

  return (
    <div className="">

      {/* Hero Section */}
     
      <div className="bg-[url('/images/background.png')] bg-cover bg-no-repeat w-screen h-screen overflow-clip">

        
      
        <div className="grid grid-cols-2">

          <DirectionalReveal direction="left-to-right" duration={2.7}>


            <div className="">

              <Image
              src={"/images/interText.png"}
              height={200}
              width={500}
              alt="img"
              />

              <Card className="w-[70vw] p-7 flex flex-col ml-7 text-white bg-orange-600 border-0">

            
                <CardContent className="">


                  <h1 className="text-2xl mb-7">
                    Multi-Modal Art Project
                  </h1>

                  <h3>
                    This project is a multi-modal one, started with a sketch and then used that sketch
                    to drive the creative direction of the webpage through generative Ai models.
                  </h3>
                  
                </CardContent>

              </Card>

            </div>
          </DirectionalReveal>


          <DirectionalReveal direction="bottom-to-top" duration={2.7}>

            <Image
              src={"/images/transparent.png"}
              height={200}
              width={400}
              alt="img"
              className="ml-0 sm:ml-0 md:ml-40 lg:ml-48 mt-136 md:mt-100 lg:mt-100 justify-end"
            />

          </DirectionalReveal>
          


    


          

        </div>

      </div>


      {/* Timeline Section */}

      <div className="relative w-full min-h-screen overflow-hidden">

        {/* Dither background - absolute so it covers the full section */}
        <div className="absolute inset-0">
          <Dither
            waveColor={[0.2, 0.7, 1]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.003}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>

        {/* Timeline content - relative so it sits above Dither and participates in layout */}
        <div className="relative z-10 px-4 py-16 sm:px-6 md:px-8 max-w-5xl mx-auto">

          <h1 className={`${bungee.className}
          text-3xl text-center text-white mb-7`}>Design Process Timeline:</h1>

          <Timeline events={data}
          config={{
              showReplayButton: true,
              lineGradient: "from-yellow-500 via-orange-500 to-purple-500",
              animationDelay: 0.2,
              animated: true
            }}

          />

        </div>

      </div>


      {/* Tooling Section */}

      <div className="bg-[url('/images/toolsBackground.png')] bg-cover bg-center w-full min-h-screen flex flex-col items-center px-4 sm:px-8 py-14">

        <h1 className={`${bungee.className}
        text-2xl text-white text-center mb-10`}>Tools used in the project:</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
          {tools.map(({image, title, use}, index) => (
            <Card key={index} className="bg-purple-900 border-0">
              <CardContent className="flex flex-col items-center p-6">

                <DirectionalReveal variant="fade">


                  <Image
                    src={image}
                    width={80}
                    height={80}
                    alt={title}
                    className="rounded-2xl mb-20"
                  />

                </DirectionalReveal>


                <h2 className="text-white text-xl font-semibold text-center mb-3">{title}</h2>

                <p className="text-white/80 text-sm text-center leading-relaxed">{use}</p>

              </CardContent>
            </Card>
          ))}å
        </div>

      </div>


      {/* Project workflow */}


      <div className="flex flex-col items-center justify-center w-screen h-auto bg-gradient-to-r from-red-500 via-green-500 to-blue-500  ">

        <div  className={""}>
          <Image
          src={"/images/projectWorkflow.png"}
          height={600}
          width={400}
          alt="img"
          className="h-auto w-screen"
          quality={99}
          priority={true}
          />

        </div>

        

      </div>

      {/* Split image */}

      <div id="container" className="relative h-screen w-screen overflow-hidden">

        <div className="grid grid-cols-2 h-full">

          <div className="bg-white flex items-center justify-center">

            <DirectionalReveal direction="left-to-right" duration={3.3}>


              <Image
                src={"/images/blackStroke.png"}
                width={300}
                height={300}
                alt="Line art sketch"
              />
            </DirectionalReveal>
          </div>

          <div className="bg-black flex items-center justify-center">
            <DirectionalReveal direction="right-to-left" duration={3.3}>

              <Image
                src={"/images/transparent.png"}
                width={300}
                height={300}
                alt="Colored version"
              />
            </DirectionalReveal>
          </div>

        </div>

  
        <Image
          src={"/images/interText.png"}
          width={300}
          height={100}
          alt="Intergalactron"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        />


      </div>




      {/* Process Video Section */}

      <div className="bg-[url('/images/background.png')] bg-cover bg-no-repeat w-screen h-[140vh] flex flex-col gap-14 items-center justify-center-safe">

        <Card className="p-8">
          <CardTitle className={bungee.className}>Sketch Process Video Bellow:</CardTitle>
        </Card>


        <DirectionalReveal direction="bottom-to-top">

          <video loop controls autoPlay  src="/videos/Extent_to_36.mp4" className="w-[55vw] h-auto rounded-3xl"></video>
        </DirectionalReveal>


      </div>


      {/* Grok Imagine Video Section */}


      <div className="bg-[url('/images/background.png')] bg-cover bg-no-repeat w-screen h-[140vh] flex flex-col gap-14 items-center justify-center-safe">

        <Card className="p-8">
          <CardTitle className={bungee.className}>Ai Generated Video Bellow:</CardTitle>
          <CardContent className="text-center">press play to watch video bellow</CardContent>
        </Card>


        <DirectionalReveal direction="bottom-to-top">

          <video loop controls   src="/videos/cityVenture1.mp4" className="w-[55vw] h-auto rounded-3xl"></video>
        </DirectionalReveal>


      </div>


      {/* Character Image Sections */}


      <div className="flex flex-col items-center justify-center w-screen h-auto bg-gradient-to-r from-red-500 via-green-500 to-blue-500  ">

        <div  className={""}>
          <Image
          src={"/images/shematicBody1.png"}
          height={600}
          width={400}
          alt="img"
          className="h-auto w-screen"
          quality={99}
          priority={true}
          />

        </div>

        

      </div>


       <div className="flex flex-col items-center justify-center w-screen h-auto bg-gradient-to-r from-red-500 via-green-500 to-blue-500  ">

        <div  className={""}>
          <Image
          src={"/images/shematicBody2.png"}
          height={600}
          width={400}
          alt="img"
          className="h-auto w-screen"
          quality={99}
          priority={true}
          />

        </div>

        

      </div>

      {/* Project Importance Section */}

    

      <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center">

        {/* Dither background - absolute so it covers the full section */}
        <div className="absolute inset-0">
          <Dither
            waveColor={[0.2, 0.7, 1]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.5}
            colorNum={4}
            waveAmplitude={0.003}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>

        {/* Timeline content - relative so it sits above Dither and participates in layout */}
        <div className="relative z-10 px-4 py-16 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center  ">

         

          <DirectionalReveal direction="bottom-to-top" variant="wipe">

          <Card className={`${saira.className}
          p-7 flex flex-col items-center w-[70vw] `}>

            <CardTitle className="text-3xl">Why Multi-Modal art Projects are important:</CardTitle>

            <CardContent className="text-center">

              These types of art projects are important, not only because they allow you to practice all your core skills simultaneously, ranging from design, art, and  web development, but as they allow you to mimic Ai systems which are becoming Multi-Modal as current technological trends favor such systems. The idea is to become comfortable with harnessing your creative abilities and dispersing them across a range of modalities to create immersive digital experiences, which essentially leaves your own unique create footprint embedded in the project.


            </CardContent>
          </Card>
        </DirectionalReveal>

        </div>

      </div>


      {/* 3D Animation Viewer Section */}

      <AnimationViewer />


    </div>
  );
}
