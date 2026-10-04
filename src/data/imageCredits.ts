// Photography: openly licensed images from Wikimedia Commons, bundled locally in
// /public/images so the prototype never depends on a remote image host. Each is
// credited here (and in the Prototype lens) as its licence requires.
export interface ImageCredit { slot: string; title: string; author: string; license: string; source: string }

export const IMAGE_CREDITS: ImageCredit[] = [
  {"slot": "home", "title": "Southern Veranda - First Floor - House of Sarat Chandra Chattopadhyay - Samtaber - Howrah 2014-10-19 9824.JPG", "author": "Biswarup Ganguly", "license": "CC BY 3.0", "source": "https://commons.wikimedia.org/wiki/File:Southern_Veranda_-_First_Floor_-_House_of_Sarat_Chandra_Chattopadhyay_-_Samtaber_-_Howrah_2014-10-19_9824.JPG"},
  {"slot": "lane", "title": "Pathway in Fontainhas with potted plants and Transformers.jpg", "author": "iMahesh", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Pathway_in_Fontainhas_with_potted_plants_and_Transformers.jpg"},
  {"slot": "spices", "title": "Indian spices,palayam market,thiruvananthapuram,kerala.jpg", "author": "Indurema", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Indian_spices,palayam_market,thiruvananthapuram,kerala.jpg"},
  {"slot": "tools", "title": "Toolbox-vintage-werkzeugkiste-alt-01.jpg", "author": "Ctsu", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Toolbox-vintage-werkzeugkiste-alt-01.jpg"},
  {"slot": "ac", "title": "Panasonic AIR CONDITIONER OUTDOOR UNIT.jpg", "author": "Dinkun Chen", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Panasonic_AIR_CONDITIONER_OUTDOOR_UNIT.jpg"},
  {"slot": "station", "title": "Pune Junction railway station in the evening.jpg", "author": "DesiBoy101", "license": "CC BY 4.0", "source": "https://commons.wikimedia.org/wiki/File:Pune_Junction_railway_station_in_the_evening.jpg"},
  {"slot": "auto", "title": "Auto rickshaws in Ahmedabad.jpg", "author": "Bernard Gagnon", "license": "CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:Auto_rickshaws_in_Ahmedabad.jpg"},
  {"slot": "theatre", "title": "Grand Théâtre Tours - Scène et parterre.jpg", "author": "Antoine Montulé", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Grand_Th%C3%A9%C3%A2tre_Tours_-_Sc%C3%A8ne_et_parterre.jpg"},
  {"slot": "seats", "title": "Columbia City Cinema main hall.jpg", "author": "Joe Mabel", "license": "CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:Columbia_City_Cinema_main_hall.jpg"},
  {"slot": "cinema", "title": "Luxury Movie Theater Seats.jpg", "author": "Author0612", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Luxury_Movie_Theater_Seats.jpg"},
  {"slot": "heritage", "title": "The entrance of Shaniwar Wada..JPG", "author": "Aakash.gautam", "license": "CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:The_entrance_of_Shaniwar_Wada..JPG"},
  {"slot": "diya", "title": "Happy Diwali - Festival of light.jpg", "author": "Ramesh NG", "license": "CC BY-SA 2.0", "source": "https://commons.wikimedia.org/wiki/File:Happy_Diwali_-_Festival_of_light.jpg"},
  {"slot": "ellora", "title": "Ellora Caves, India, Religious shrines in Kailash-Kailasa Temple.jpg", "author": "Vyacheslav Argenberg", "license": "CC BY 4.0", "source": "https://commons.wikimedia.org/wiki/File:Ellora_Caves,_India,_Religious_shrines_in_Kailash-Kailasa_Temple.jpg"},
  {"slot": "library", "title": "13-11-02-olb-by-RalfR-03.jpg", "author": "Ralf Roletschek", "license": "CC BY 3.0", "source": "https://commons.wikimedia.org/wiki/File:13-11-02-olb-by-RalfR-03.jpg"},
  {"slot": "chai", "title": "Masala Tea 2.jpg", "author": "Gaurav Dhwaj Khadka", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Masala_Tea_2.jpg"},
  {"slot": "instruments", "title": "2024-03-22 Tanpuras, Tabala-dagga, Pakhavaj, and Harmonium in Raja Dinkar Kelkar Museum, Pune.jpg", "author": "Alexkom000", "license": "CC BY 4.0", "source": "https://commons.wikimedia.org/wiki/File:2024-03-22_Tanpuras,_Tabala-dagga,_Pakhavaj,_and_Harmonium_in_Raja_Dinkar_Kelkar_Museum,_Pune.jpg"},
  {"slot": "musicians", "title": "Kathmandu-21.JPG", "author": "Sigismund von Dobschütz", "license": "CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:Kathmandu-21.JPG"},
  {"slot": "thali", "title": "'8' A Thali, a traditional style of serving meal in India.jpg", "author": "Seba Della y Sole Bossio", "license": "CC BY 2.0", "source": "https://commons.wikimedia.org/wiki/File:%278%27_A_Thali,_a_traditional_style_of_serving_meal_in_India.jpg"},
  {"slot": "paints", "title": "Gouache.jpg", "author": "Jeff Dahl", "license": "CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:Gouache.jpg"},
  {"slot": "phone", "title": "Hands-coffee-smartphone-technology (23698591814).jpg", "author": "www.Pixel.la Free Stock Photos", "license": "CC0", "source": "https://commons.wikimedia.org/wiki/File:Hands-coffee-smartphone-technology_(23698591814).jpg"},
  {"slot": "temple", "title": "Shikhara of temples on Parvati Hill, Pune (5).jpg", "author": "DesiBoy101", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Shikhara_of_temples_on_Parvati_Hill,_Pune_(5).jpg"},
  {"slot": "park", "title": "Empress Garden Pune Neha shrivastava 05.JPG", "author": "Neha.shrivastav", "license": "CC BY-SA 3.0", "source": "https://commons.wikimedia.org/wiki/File:Empress_Garden_Pune_Neha_shrivastava_05.JPG"},
  {"slot": "hibiscus", "title": "Indian Independence day celebration 216th flower show 2024, Lalbagh, Bangalore 129.jpg", "author": "Gpkp", "license": "CC BY-SA 4.0", "source": "https://commons.wikimedia.org/wiki/File:Indian_Independence_day_celebration_216th_flower_show_2024,_Lalbagh,_Bangalore_129.jpg"},
  {"slot": "meeting", "title": "Chairs in a meeting room (Unsplash).jpg", "author": "Breather breather", "license": "CC0", "source": "https://commons.wikimedia.org/wiki/File:Chairs_in_a_meeting_room_(Unsplash).jpg"},
];
