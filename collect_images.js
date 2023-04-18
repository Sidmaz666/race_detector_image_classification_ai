const googleImage = require('@marsron/google-image')
const countries = require('./resources/countries.js')
const fs = require('fs').promises
const axios = require('axios')
const imageType = require('image-type');
const green = "\x1b[32m"
const red = "\x1b[35m"
const reset = "\x1b[0m"


async function downloadImage(imageUrl, savePath) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const type = imageType(imageBuffer);
    if(type.ext !== 'webp'){
    await fs.writeFile(`${savePath}.${type.ext}`, imageBuffer);
    }
    console.log(green,`Image downloaded and saved to ${savePath}`,reset);
  } catch (error) {
    console.error(red,`Error downloading image: ${error} , url: ${imageUrl}`,reset);
  }
}

async function get_image_urls(query){
  try {
    const list  = []
    const url = await googleImage(query,{limit:10, blacklistDomains: [
      's3.reutersmedia.net',
      'facebook.com',
      'pinterest.com',
      'deviantart.com',
      'twitter.com'
    ]})
    for (let i = 0; i < url.length; i++) {
    	 list.push(url[i].url.toString().trim())
    }
    return list
  } catch(error) {
    console.error(error)
  }
}

async function get_image_by_country(){
	const url = []
  	//countries.length
	for (let i = 0;i < 3; i++) {
		const country = countries[i]
	  	const gen_l = []
	  for (let j = 0; j < 2; j++) {
		  const query = `${country} ${j==0? 'man/boy' : 'woman/girl'} photo`
	    	  const links = await get_image_urls(query)
	    		if(j==0){
			 gen_l.push({ male : links })
			} else {
			 gen_l.push({ female : links })
			}


	  	}
	    url.push({  country : [country, gen_l] })
	}
  return url
}

(async function(){
  
  const list = await get_image_by_country()

  for (let i = 0; i < list.length; i++) {
  const country = list[i].country[0]
 
  const male_images = list[i].country[1][0].male
  const female_images = list[i].country[1][1].female
  
  await fs.mkdir(`./images/${country}`)

  for (let j = 0; j < female_images.length; j++) {
      await downloadImage(female_images[j],`./images/${country}/${Math.random().toString(36).slice(2, 50)}`)
  }

  for (let z = 0; z < male_images.length; z++) {
      await downloadImage(male_images[z],`./images/${country}/${Math.random().toString(36).slice(2, 50)}`)
  }
  
  }
  	
})()
