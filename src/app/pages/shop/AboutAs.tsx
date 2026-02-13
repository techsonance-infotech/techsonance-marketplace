

const AboutPageContent = {
  heroTitle: "ABOUT US",
  heroDesc: "  We are Passionate About Our Work",
  heroImg: "https://static.vecteezy.com/system/resources/previews/022/281/057/original/halftone-gradient-background-with-dots-abstract-blue-dotted-pop-art-pattern-in-comic-style-illustration-vector.jpg",
  ownThoughtsImg: "https://www.mivi.in/cdn/shop/files/SuperPods_Opera_ENC_-_Blue.png?v=1730114006&width=1500",
  founderImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  founderName: "john doe",
  founderTitle: "Founder & CEO",
  ownThoughtsTitle: "We strive to provide our customers with the highest quality",
  ownThoughtsDesc: "products and services. Our team is dedicated to ensuring that every customer has a positive experience with our brand. We are committed to delivering exceptional value and exceeding our customers' expectations. We believe in building long-term relationships with our customers based on trust, transparency, and mutual respect. Our goal is to create a community of satisfied customers who can rely on us for all their tech needs.",
  coreValuesImg: "https://wallpaper.forfun.com/fetch/d1/d17e24d67388285f8e284a58a36a866f.jpeg?w=1470&r=0.5625&f=webp",
  coreValuesTitle: "Our Core Values that Drive Everything We Do",
  coreValuesDesc: "At Techsonance, our core values are the foundation of our company culture and guide us in everything we do. We are committed to innovation, quality, and customer satisfaction. We believe in fostering a collaborative and inclusive work environment where creativity thrives. Our dedication to excellence drives us to continuously improve and deliver exceptional products and services to our customers.",
  coreValues: [
    {
      "id": 1,
      "title": "Innovation",
      "tagline": "Acoustic Avant-Garde",
      "description": "We are committed to pushing the boundaries of technology and delivering innovative solutions that meet the evolving needs of our customers."
    },
    {
      "id": 2,
      "title": "Quality",
      "tagline": "Uncompromising Fidelity",
      "description": "We prioritize quality in everything we do, from product development to customer service, ensuring that our customers receive the best possible experience."
    },
    {
      "id": 3,
      "title": "Customer Satisfaction",
      "tagline": "The Audiophile Journey",
      "description": "Our customers are at the heart of everything we do, and we are dedicated to providing exceptional service and support to ensure their satisfaction."
    },
    {
      "id": 4,
      "title": "Collaboration",
      "tagline": "Harmonious Synergy",
      "description": "We believe in fostering a collaborative work environment where creativity thrives and diverse perspectives are valued."
    }
  ],
  ourJourneyTitle: "Our Journey: From Humble Beginnings to Tech Excellence",
  ourJourneyDesc: "Techsonance started as a small startup with a vision to revolutionize the tech industry. With a passionate team and a commitment to innovation, we have grown into a leading technology company. Our journey has been marked by milestones, challenges, and successes that have shaped us into the company we are today. We are proud of our achievements and excited for the future as we continue to push the boundaries of technology and deliver exceptional products and services to our customers.",
  missionImg: "https://www.mivi.in/cdn/shop/files/For_Why_section_1_044b23b6-dbbd-4b3b-9307-1970700eb153.png?v=1748874263&width=2500&format=webp&quality=80",
  missionTitle: "Our Mission",
  missionDesc: "To redefine the art of listening by fusing collaborative creativity with innovative acoustic engineering. We are dedicated to crafting audio masterpieces of uncompromising quality, ensuring that the satisfaction of the discerning listener remains the heartbeat of our brand.",
  missionToDeliver: [
    {
      "id": 1,
      "title": "Innovation",
      "tagline": "Acoustic Avant-Garde",
      "description": "We are committed to pushing the boundaries of technology and delivering innovative solutions that meet the evolving needs of our customers."
    },
    {
      "id": 2,
      "title": "Quality",
      "tagline": "Uncompromising Fidelity",
      "description": "We prioritize quality in everything we do, from product development to customer service, ensuring that our customers receive the best possible experience."
    },
    {
      "id": 3,
      "title": "Customer Satisfaction",
      "tagline": "The Audiophile Journey",
      "description": "Our customers are at the heart of everything we do, and we are dedicated to providing exceptional service and support to ensure their satisfaction."
    },
    {
      "id": 4,
      "title": "Collaboration",
      "tagline": "Harmonious Synergy",
      "description": "We believe in fostering a collaborative work environment where creativity thrives and diverse perspectives are valued."
    }]

}
export function AboutAs() {
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center text-center py-20 relative bg-[url('https://static.vecteezy.com/system/resources/previews/022/281/057/original/halftone-gradient-background-with-dots-abstract-blue-dotted-pop-art-pattern-in-comic-style-illustration-vector.jpg')] bg-cover bg-center bg-no-repeat">
        <h2 className=" font-bold text-white">{AboutPageContent.heroTitle}</h2>
        <p className="text-5xl text-white max-w-2xl">
          {AboutPageContent.heroDesc}
        </p>
      </div>
      <div className=" xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1 flex gap-8 items-start justify-between" >
        <div className="flex-1">

          <img src={AboutPageContent.ownThoughtsImg} alt="" className="flex-1 w-84 rounded-3xl object-cover h-102 shadow-xl " />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{AboutPageContent.ownThoughtsTitle}</h1>
          <p className="mt-4">
            {AboutPageContent.ownThoughtsDesc}
          </p>

          <div className="flex mt-4 gap-4 items-center">
            <img src={AboutPageContent.founderImg} alt="" className="w-16 h-16 object-cover object-top rounded-full" />
            <span>
              <h3 className="text-lg font-medium text-gray-900">{AboutPageContent.founderName}</h3>
              <p className="text-gray-600">{AboutPageContent.founderTitle}</p>
            </span>
          </div>
        </div>

      </div>
      <div className="my-6 bg-[url('https://wallpaper.forfun.com/fetch/d1/d17e24d67388285f8e284a58a36a866f.jpeg?w=1470&r=0.5625&f=webp')] bg-contain bg-center   xl:py-10 py-6 px-10" >
        <h1 className="text-primary text-center text-3xl font-bold">
          {AboutPageContent.coreValuesTitle}
        </h1 >
        <p className="text-center text-white   mt-4 max-w-2xl mx-auto">
          {AboutPageContent.coreValuesDesc}
        </p>

      </div>
      <div className="flex  xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1 gap-8 items-start justify-center flex-wrap" >
        <div className="left_section flex-1">
          <h1 className="text-2xl font-bold">
            {AboutPageContent.missionTitle}
          </h1>
          <p className="mt-4">
            {AboutPageContent.missionDesc}
          </p>
          <div className="grid grid-cols-2 gap-6">
            {
              AboutPageContent.missionToDeliver.map(mission => (
                <div key={mission.id} className="mt-4">
                  <h3 className="text-lg  font-bold">{mission.title}</h3>
                  <p className="text-gray-600 mt-2">{mission.description}</p>
                </div>
              ))
            }
          </div>
        </div>
        <div className="right_section flex-1  flex   justify-end" >
          <img className="self-end w-84 rounded-3xl object-cover h-102 shadow-xl " src={AboutPageContent.missionImg} alt="" />
        </div>
      </div>
    </>
  )
}
