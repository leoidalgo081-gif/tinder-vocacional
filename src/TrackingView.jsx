import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Lock, Phone, MessageSquare, PlusCircle, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ArrowLeft, UserCircle } from 'lucide-react';
import './TrackingView.css';

// The provided participant list
const INITIAL_BODIES = [
  { rank: 2, name: "Ana", age: 18, score: 13999, phone: "5511958604709", link: "https://wa.me/5511958604709?text=%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%20Ana%2C%20isso%20%C3%A9%20INCR%C3%8DVEL%21%20%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%0A%0AVoc%C3%AA%20conseguiu%20ficar%20em%20%2A%2A%F0%9F%A5%87%20PRIMEIRO%20LUGAR%2A%2A%20no%20nosso%20matching%21%20%F0%9F%98%B1%E2%9C%A8%0ASua%20pontua%C3%A7%C3%A3o%20foi%2013999%20%E2%80%94%20algo%20realmente%20impressionante%21%20%F0%9F%92%A5%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20teremos%20uma%20%2A%2Avig%C3%ADlia%20jovem%2A%2A%20muito%20especial.%0AQuer%20vir%20conhecer%20mais%20do%20nosso%20carisma%3F%20Seria%20maravilhoso%20ter%20voc%C3%AA%20com%20a%20gente%20%F0%9F%92%99%F0%9F%99%8F" },
  { rank: 5, name: "Anna", age: 20, score: 13780, phone: "5511982015181", link: "https://wa.me/5511982015181?text=Oi%20Anna%21%20Que%20bom%20te%20reencontrar%21%20%F0%9F%99%8C%0A%0AA%20gente%20se%20conheceu%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0AVoc%C3%AA%20ficou%20entre%20os%20%2A%2ATOP%2010%2A%2A%20do%20nosso%20matching%20com%2013780%20pontos%20%F0%9F%98%8D%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem%20feita%20com%20muito%20carinho%20%F0%9F%92%99%0AQue%20tal%20conhecer%20um%20pouco%20mais%20do%20nosso%20carisma%3F" },
  { rank: 6, name: "Yasmim", age: 17, score: 13732, phone: "5511970160048", link: "https://wa.me/5511970160048?text=Oi%20Yasmim%21%20Que%20bom%20te%20reencontrar%21%20%F0%9F%99%8C%0A%0AA%20gente%20se%20conheceu%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0AVoc%C3%AA%20ficou%20entre%20os%20%2A%2ATOP%2010%2A%2A%20do%20nosso%20matching%20com%2013732%20pontos%20%F0%9F%98%8D%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem%20feita%20com%20muito%20carinho%20%F0%9F%92%99%0AQue%20tal%20conhecer%20um%20pouco%20mais%20do%20nosso%20carisma%3F" },
  { rank: 7, name: "Giovanna", age: 21, score: 13443, phone: "5511994819426", link: "https://wa.me/5511994819426?text=Oi%20Giovanna%21%20Que%20alegria%20falar%20com%20voc%C3%AA%20%F0%9F%98%8A%0A%0AA%20gente%20se%20conheceu%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0ASeu%20resultado%20foi%20incr%C3%ADvel%3A%2013443%20pontos%20no%20matching%20%F0%9F%91%80%E2%9C%A8%0A%0ANeste%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20super%20especial%20%E2%9C%A8%0AFica%20o%20convite%20pra%20vir%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%98%8A" },
  { rank: 8, name: "Kelly", age: 15, score: 13420, phone: "5511963604858", link: "https://wa.me/5511963604858?text=Oi%20Kelly%21%20Que%20bom%20te%20reencontrar%21%20%F0%9F%99%8C%0A%0AVoc%C3%AA%20lembra%20da%20gente%20do%20stand%20vocacional%20de%20s%C3%A1bado%3F%0AVoc%C3%AA%20ficou%20entre%20os%20%2A%2ATOP%2010%2A%2A%20do%20nosso%20matching%20com%2013420%20pontos%20%F0%9F%98%8D%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem%20feita%20com%20muito%20carinho%20%F0%9F%92%99%0AFica%20o%20convite%20pra%20vir%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%98%8A" },
  { rank: 9, name: "Helena", age: 15, score: 13292, phone: "5511959842293", link: "https://wa.me/5511959842293?text=Oi%20Helena%21%20Que%20alegria%20falar%20com%20voc%C3%AA%20%F0%9F%98%8A%0A%0AVoc%C3%AA%20lembra%20da%20gente%20do%20stand%20vocacional%20de%20s%C3%A1bado%3F%0ASeu%20resultado%20foi%20incr%C3%ADvel%3A%2013292%20pontos%20no%20matching%20%F0%9F%91%80%E2%9C%A8%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem%20feita%20com%20muito%20carinho%20%F0%9F%92%99%0AFica%20o%20convite%20pra%20vir%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%98%8A" },
  { rank: 10, name: "Maria", age: 16, score: 13220, phone: "5511934290710", link: "https://wa.me/5511934290710?text=Oi%20Maria%21%20Que%20alegria%20falar%20com%20voc%C3%AA%20%F0%9F%98%8A%0A%0AA%20gente%20se%20conheceu%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0ASeu%20resultado%20foi%20incr%C3%ADvel%3A%2013220%20pontos%20no%20matching%20%F0%9F%91%80%E2%9C%A8%0A%0ANeste%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20super%20especial%20%E2%9C%A8%0AQue%20tal%20conhecer%20um%20pouco%20mais%20do%20nosso%20carisma%3F" },
  { rank: 11, name: "Catarina", age: 14, score: 13175, phone: "5511992336964", link: "https://wa.me/5511992336964?text=Ol%C3%A1%20Catarina%21%20Tudo%20bem%20por%20a%C3%AD%3F%20%E2%9C%A8%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0ASeu%20resultado%20no%20matching%20foi%2013175%20pontos%20%F0%9F%98%8A%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem.%0AQuer%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 12, name: "Gabriele", age: 26, score: 13160, phone: "5511968625624", link: "https://wa.me/5511968625624?text=Oi%20Gabriele%21%20Passando%20pra%20te%20dar%20um%20oi%20%F0%9F%98%84%0A%0AA%20gente%20se%20encontrou%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0ASeu%20resultado%20no%20matching%20foi%2013160%20pontos%20%F0%9F%98%8A%0A%0ANeste%20pr%C3%B3ximo%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20bem%20especial.%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 13, name: "Isabella", age: 15, score: 13073, phone: "5511933963311", link: "https://wa.me/5511933963311?text=Ol%C3%A1%20Isabella%21%20Tudo%20bem%20por%20a%C3%AD%3F%20%E2%9C%A8%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0AOlhei%20seu%20matching%20e%20deu%2013073%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 14, name: "Caio", age: 17, score: 12757, phone: "5511942457108", link: "https://wa.me/5511942457108?text=Oi%20Caio%21%20Tudo%20bem%3F%20%F0%9F%98%8A%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AVi%20aqui%20que%20voc%C3%AA%20fez%2012757%20pontos%20no%20nosso%20matching%20%E2%80%94%20muito%20bom%21%20%F0%9F%98%84%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem.%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 15, name: "Mamuella", age: 14, score: 12704, phone: "5511982151073", link: "https://wa.me/5511982151073?text=Ol%C3%A1%20Mamuella%21%20Tudo%20bem%20por%20a%C3%AD%3F%20%E2%9C%A8%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0AVi%20aqui%20que%20voc%C3%AA%20fez%2012704%20pontos%20no%20nosso%20matching%20%E2%80%94%20muito%20bom%21%20%F0%9F%98%84%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 16, name: "Eduardo", age: 13, score: 12567, phone: "5511997290467", link: "https://wa.me/5511997290467?text=Oi%20Eduardo%21%20Que%20bom%20falar%20com%20voc%C3%AA%20%F0%9F%99%8C%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0ASeu%20resultado%20no%20matching%20foi%2012567%20pontos%20%F0%9F%98%8A%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 17, name: "Nikelly", age: 18, score: 12403, phone: "5511965648165", link: "https://wa.me/5511965648165?text=Oi%20Nikelly%21%20Passando%20pra%20te%20dar%20um%20oi%20%F0%9F%98%84%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0ASeu%20resultado%20no%20matching%20foi%2012403%20pontos%20%F0%9F%98%8A%0A%0ANeste%20pr%C3%B3ximo%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20bem%20especial.%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 18, name: "Davi", age: 36, score: 12266, phone: "5511986619208", link: "https://wa.me/5511986619208?text=Oi%20Davi%21%20Tudo%20bem%3F%20%F0%9F%98%8A%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AVi%20aqui%20que%20voc%C3%AA%20fez%2012266%20pontos%20no%20nosso%20matching%20%E2%80%94%20muito%20bom%21%20%F0%9F%98%84%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem.%0AQuer%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 19, name: "Maysa", age: 14, score: 12148, phone: "5511913303848", link: "https://wa.me/5511913303848?text=Ol%C3%A1%20Maysa%21%20Tudo%20bem%20por%20a%C3%AD%3F%20%E2%9C%A8%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AOlhei%20seu%20matching%20e%20deu%2012148%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 20, name: "Antonia", age: 15, score: 12092, phone: "5511917703058", link: "https://wa.me/5511917703058?text=Oi%20Antonia%21%20Passando%20pra%20te%20dar%20um%20oi%20%F0%9F%98%84%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AVi%20aqui%20que%20voc%C3%AA%20fez%2012092%20pontos%20no%20nosso%20matching%20%E2%80%94%20muito%20bom%21%20%F0%9F%98%84%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 21, name: "Marcel", age: 16, score: 11721, phone: "5511968747568", link: "https://wa.me/5511968747568?text=Oi%20Marcel%21%20Tudo%20bem%3F%20%F0%9F%98%8A%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0ASeu%20resultado%20no%20matching%20foi%2011721%20pontos%20%F0%9F%98%8A%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 22, name: "Ivana", age: 20, score: 11699, phone: "5511958982986", link: "https://wa.me/5511958982986?text=Oi%20Ivana%21%20Que%20bom%20falar%20com%20voc%C3%AA%20%F0%9F%99%8C%0A%0AA%20gente%20se%20encontrou%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0ASeu%20resultado%20no%20matching%20foi%2011699%20pontos%20%F0%9F%98%8A%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem.%0AQuer%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 23, name: "Nathalia", age: 26, score: 11566, phone: "5511961801087", link: "https://wa.me/5511961801087?text=Oi%20Nathalia%21%20Que%20bom%20falar%20com%20voc%C3%AA%20%F0%9F%99%8C%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AVi%20aqui%20que%20voc%C3%AA%20fez%2011566%20pontos%20no%20nosso%20matching%20%E2%80%94%20muito%20bom%21%20%F0%9F%98%84%0A%0ANeste%20pr%C3%B3ximo%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20bem%20especial.%0AQuer%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 24, name: "Patricia", age: 15, score: 11086, phone: "5511962947663", link: "https://wa.me/5511962947663?text=Ol%C3%A1%20Patricia%21%20Tudo%20bem%20por%20a%C3%AD%3F%20%E2%9C%A8%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AVi%20aqui%20que%20voc%C3%AA%20fez%2011086%20pontos%20no%20nosso%20matching%20%E2%80%94%20muito%20bom%21%20%F0%9F%98%84%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 25, name: "Diogo", age: 14, score: 11083, phone: "5511966550190", link: "https://wa.me/5511966550190?text=Oi%20Diogo%21%20Passando%20pra%20te%20dar%20um%20oi%20%F0%9F%98%84%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0AOlhei%20seu%20matching%20e%20deu%2011083%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AQuer%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 26, name: "Gisele", age: 22, score: 11053, phone: "5511985865191", link: "https://wa.me/5511985865191?text=Oi%20Gisele%21%20Que%20bom%20falar%20com%20voc%C3%AA%20%F0%9F%99%8C%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0ASeu%20resultado%20no%20matching%20foi%2011053%20pontos%20%F0%9F%98%8A%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 27, name: "Mariana", age: 14, score: 10525, phone: "551199525875", link: "https://wa.me/551199525875?text=Oi%20Mariana%21%20Tudo%20bem%3F%20%F0%9F%98%8A%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0AOlhei%20seu%20matching%20e%20deu%2010525%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0ANeste%20pr%C3%B3ximo%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20bem%20especial.%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 28, name: "Enzo", age: 15, score: 10422, phone: "5511930058867", link: "https://wa.me/5511930058867?text=Oi%20Enzo%21%20Passando%20pra%20te%20dar%20um%20oi%20%F0%9F%98%84%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0ASeu%20resultado%20no%20matching%20foi%2010422%20pontos%20%F0%9F%98%8A%0A%0ANo%20pr%C3%B3ximo%20s%C3%A1bado%20vamos%20ter%20uma%20vig%C3%ADlia%20jovem.%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 29, name: "Leonardo", age: 30, score: 10348, phone: "5511977438988", link: "https://wa.me/5511977438988?text=Oi%20Leonardo%21%20Que%20bom%20falar%20com%20voc%C3%AA%20%F0%9F%99%8C%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0AOlhei%20seu%20matching%20e%20deu%2010348%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0ANeste%20pr%C3%B3ximo%20s%C3%A1bado%20teremos%20uma%20vig%C3%ADlia%20jovem%20bem%20especial.%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 30, name: "Larissa", age: 15, score: 9972, phone: "5511956404585", link: "https://wa.me/5511956404585?text=Ol%C3%A1%20Larissa%21%20Tudo%20bem%20por%20a%C3%AD%3F%20%E2%9C%A8%0A%0AN%C3%B3s%20nos%20vimos%20no%20stand%20vocacional%20s%C3%A1bado%20passado%20%F0%9F%98%8A%0AOlhei%20seu%20matching%20e%20deu%209972%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AFica%20o%20convite%20pra%20voc%C3%AA%20conhecer%20mais%20do%20nosso%20carisma%20%F0%9F%92%99" },
  { rank: 31, name: "Richard", age: 18, score: 9673, phone: "5511991365182", link: "https://wa.me/5511991365182?text=Oi%20Richard%21%20Tudo%20bem%3F%20%F0%9F%98%8A%0A%0ALembra%20da%20gente%20do%20stand%20vocacional%20do%20s%C3%A1bado%3F%0AOlhei%20seu%20matching%20e%20deu%209673%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" },
  { rank: 32, name: "Alexandre", age: 37, score: 9547, phone: "5511977061096", link: "https://wa.me/5511977061096?text=Oi%20Alexandre%21%20Passando%20pra%20te%20dar%20um%20oi%20%F0%9F%98%84%0A%0AA%20gente%20se%20encontrou%20no%20stand%20vocacional%20no%20s%C3%A1bado%2C%20lembra%3F%0AOlhei%20seu%20matching%20e%20deu%209547%20pontos%20%E2%80%94%20que%20legal%21%20%F0%9F%91%80%0A%0AEstamos%20preparando%20uma%20vig%C3%ADlia%20jovem%20para%20o%20pr%C3%B3ximo%20s%C3%A1bado%20%F0%9F%99%8F%0AVoc%C3%AA%20gostaria%20de%20conhecer%20mais%20do%20nosso%20carisma%3F" }
];

export default function TrackingView() {
  const [authKey, setAuthKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'dashboard' | 'ficha'
  const [data, setData] = useState([]);
  const [selectedRank, setSelectedRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const openFicha = (rank) => {
    setSelectedRank(rank);
    setView('ficha');
  };

  const closeFicha = () => {
    setSelectedRank(null);
    setView('list');
  };

  const getDefaultTracking = () => ({
    anotacoes: '',
    aceitouConviteVigilia: '',
    conversouBem: '',
    rezei: '',
    segundaAbordagemVigilia: '',
    convidarAmigo: '',
    ajudaIda: '',
    foiNaVigilia: '',
    aceitouGO: '',
    segundaAbordagemGO: '',
    foiNoGO: '',
    interesse: 0, // 0 to 5
    acompanhador: ''
  });

  const mergeData = (dbMatches) => {
    const merged = [...INITIAL_BODIES.map(p => ({
      ...p,
      tracking: getDefaultTracking()
    }))];

    dbMatches.forEach(dbPerson => {
      const cleanDbPhone = dbPerson.phone?.replace(/\D/g, '') || '';
      
      const index = merged.findIndex(p => {
        const cleanPPhone = p.phone?.replace(/\D/g, '') || '';
        const isSamePhone = (p.phone === dbPerson.phone) || 
                            (cleanPPhone === cleanDbPhone) || 
                            (cleanPPhone === `55${cleanDbPhone}`) || 
                            (`55${cleanPPhone}` === cleanDbPhone);
        return isSamePhone || (p.name === dbPerson.name && p.age === dbPerson.age);
      });

      if (index !== -1) {
        // Preserva o nome, link e telefone do INITIAL_BODIES
        merged[index] = { 
          ...merged[index], 
          score: dbPerson.points, 
          tracking: { ...merged[index].tracking, ...(dbPerson.tracking || {}) },
          db_id: dbPerson.id
        };
      } else {
        const phoneWithCountry = cleanDbPhone.startsWith('55') ? cleanDbPhone : `55${cleanDbPhone}`;
        merged.push({ 
          name: dbPerson.name,
          age: dbPerson.age,
          score: dbPerson.points,
          phone: dbPerson.phone,
          link: `https://wa.me/${phoneWithCountry}`,
          rank: dbPerson.id,
          tracking: { ...getDefaultTracking(), ...(dbPerson.tracking || {}) },
          db_id: dbPerson.id
        });
      }
    });

    return merged.sort((a, b) => b.score - a.score);
  };

  const fetchAndSync = async () => {
    const { data: dbMatches, error } = await supabase
      .from('matches')
      .select('*');
    
    if (error) {
      console.error('Error fetching:', error);
    } else {
      setData(mergeData(dbMatches || []));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAndSync();

    const channel = supabase
      .channel('tracking_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'matches' 
      }, () => {
        fetchAndSync();
      })
      .subscribe();

    // Fallback polling de 5 segundos para caso a rede móvel perca o websocket
    const intervalId = setInterval(() => {
      fetchAndSync();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (authKey === 'shalom2026') {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta.");
    }
  };

  const updateTracking = async (rank, field, value) => {
    const person = data.find(p => p.rank === rank);
    if (!person) return;

    const newTracking = { ...person.tracking, [field]: value };
    
    // Optimistic local update
    setData(prev => prev.map(p => {
      if (p.rank === rank) return { ...p, tracking: newTracking };
      return p;
    }));

    if (person.db_id) {
      // Atualiza o registro existente usando o ID do banco
      const { error } = await supabase
        .from('matches')
        .update({ tracking: newTracking })
        .eq('id', person.db_id);

      if (error) console.error('Error updating tracking:', error);
    } else {
      // Anna e outros da lista inicial que ainda não existem no banco são inseridos
      const { error } = await supabase
        .from('matches')
        .insert([{
          name: person.name,
          phone: person.phone,
          age: person.age,
          points: person.score,
          tracking: newTracking
        }]);

      if (error) console.error('Error inserting tracking:', error);
    }
  };

  const calculateProgress = (tracking) => {
    let completed = 0;
    const totalFields = 11; // Total Boolean/Select fields
    
    if (tracking.aceitouConviteVigilia) completed++;
    if (tracking.conversouBem) completed++;
    if (tracking.rezei) completed++;
    if (tracking.segundaAbordagemVigilia) completed++;
    if (tracking.convidarAmigo) completed++;
    if (tracking.ajudaIda) completed++;
    if (tracking.foiNaVigilia) completed++;
    if (tracking.aceitouGO) completed++;
    if (tracking.segundaAbordagemGO) completed++;
    if (tracking.foiNoGO) completed++;
    if (tracking.acompanhador) completed++;

    return Math.round((completed / totalFields) * 100);
  };

  const getAnalytics = (tracking) => {
    let int = 0;
    let des = 0;
    
    // Evaluate qualitative fields
    const fields = [
      tracking.aceitouConviteVigilia, tracking.conversouBem, tracking.segundaAbordagemVigilia,
      tracking.convidarAmigo, tracking.ajudaIda, tracking.foiNaVigilia,
      tracking.aceitouGO, tracking.segundaAbordagemGO, tracking.foiNoGO
    ];

    fields.forEach(val => {
      if (!val) return;
      const v = val.toLowerCase();
      
      // Interest triggers
      if (v.includes('sim') || v.includes('interessada') || v.includes('tranquilo') || v.includes('falei animado') || v.includes('muito')) {
        int += 2;
      } 
      // Resistance triggers
      else if (v.includes('não respondeu') || v.includes('fechado') || v.includes('frio') || v.includes('vácuo') || v.includes('não foi') || v.includes('não apareceu') || v.includes('recusou')) {
        des += 2;
      }
      // Neutral / Mild Resistance
      else if (v.includes('não deu tempo') || v.includes('esqueci') || v.includes('não consegue')) {
        des += 1;
      }
      else {
        // "Ainda vai pensar", "Não pode agora mas quer"
        int += 1; 
      }
    });

    const totalScore = int + des;
    const intPct = totalScore > 0 ? Math.round((int / totalScore) * 100) : 50;
    const desPct = totalScore > 0 ? Math.round((des / totalScore) * 100) : 50;

    return { int, des, intPct, desPct };
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <Lock size={48} color="#D4AF37" style={{ marginBottom: '1rem' }} />
          <h2 className="auth-title">Acesso Restrito</h2>
          <p style={{ color: '#b4b4b4', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Digite a senha da equipe para acessar o acompanhamento do Stand.
          </p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="Senha de acesso" 
              value={authKey} 
              onChange={e => setAuthKey(e.target.value)} 
            />
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
              ENTRAR NA PLANILHA
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const total = data.length;
  const conversados = data.filter(d => d.tracking.conversouBem === 'Sim').length;
  const confirmadosVigilia = data.filter(d => d.tracking.aceitouVigilia === 'Sim aceitou').length;
  const muitoInteressados = data.filter(d => d.tracking.interesse >= 4).length;
  const praOração = data.filter(d => d.tracking.grupoDeOracao === 'Sim').length;
  const galeraRezada = data.filter(d => d.tracking.rezei === 'Sim').length;

  const interestDist = {
    5: data.filter(d => d.tracking.interesse === 5).length,
    4: data.filter(d => d.tracking.interesse === 4).length,
    3: data.filter(d => d.tracking.interesse === 3).length,
    2: data.filter(d => d.tracking.interesse === 2).length,
    1: data.filter(d => d.tracking.interesse === 1).length,
    0: data.filter(d => d.tracking.interesse === 0).length,
  };

  return (
    <div className="tracking-app-container">
      <div className="tracking-header">
        <h1 className="tracking-title">Match Vocacional</h1>
        <p className="tracking-subtitle">Acompanhamento Stand | Vigilância</p>
      </div>

      <div className="tracking-content">
        <div className="view-toggles">
          <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            LISTA ({total})
          </button>
          <button className={`toggle-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            GRÁFICOS
          </button>
        </div>

        {view === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="stat-value">{conversados}/{total}</span>
              <span className="stat-label">Conversei Sinc.</span>
            </div>
            <div className="stat-card" style={{border: '1px solid rgba(255, 60, 0, 0.3)', background: 'radial-gradient(circle, rgba(255,60,0,0.1) 0%, transparent 80%)' }}>
              <span className="stat-value" style={{color: '#ff3c00'}}>{confirmadosVigilia}</span>
              <span className="stat-label">Vão na Vigília</span>
            </div>
            <div className="stat-card" style={{border: '1px solid rgba(0, 200, 100, 0.3)', background: 'radial-gradient(circle, rgba(0,200,100,0.1) 0%, transparent 80%)' }}>
              <span className="stat-value" style={{color: '#00c864'}}>{muitoInteressados}</span>
              <span className="stat-label">Alto Interesse (+4★)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{color: '#D4AF37'}}>{galeraRezada}</span>
              <span className="stat-label">Rezei por Eles</span>
            </div>

            <div className="interest-chart">
              <h3 className="chart-title">Visão Geral do Evento</h3>
              
              <div className="chart-bar-row">
                <div className="chart-bar-label"><MessageSquare size={14}/> Abordados</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill slide-in" style={{width: `${(conversados/total)*100}%`, background: '#2196F3'}}></div>
                </div>
                <div className="chart-bar-value">{Math.round((conversados/total)*100 || 0)}%</div>
              </div>

              <div className="chart-bar-row">
                <div className="chart-bar-label"><CheckCircle2 size={14}/> Vigília</div>
                <div className="chart-bar-track">
                   <div className="chart-bar-fill slide-in" style={{width: `${(confirmadosVigilia/total)*100}%`, background: '#ff3c00', boxShadow: '0 0 10px rgba(255,60,0,0.5)'}}></div>
                </div>
                <div className="chart-bar-value">{Math.round((confirmadosVigilia/total)*100 || 0)}%</div>
              </div>

              <div className="chart-bar-row">
                <div className="chart-bar-label"><PlusCircle size={14}/> G.O.</div>
                <div className="chart-bar-track">
                   <div className="chart-bar-fill slide-in" style={{width: `${(praOração/total)*100}%`, background: '#00c864'}}></div>
                </div>
                <div className="chart-bar-value">{Math.round((praOração/total)*100 || 0)}%</div>
              </div>
            </div>

            <div className="interest-chart" style={{marginTop: '0.5rem'}}>
              <h3 className="chart-title">Distribuição de Interesse</h3>
              <div className="interest-bars">
                {[5, 4, 3, 2, 1].map(stars => {
                   const count = interestDist[stars];
                   const pct = total ? (count / total) * 100 : 0;
                   return (
                     <div className="interest-vertical" key={stars}>
                        <div className="interest-v-value">{count}</div>
                        <div className="interest-v-track">
                           <div className="interest-v-fill slide-up" style={{height: `${pct}%`, background: stars >= 4 ? '#00c864' : stars === 3 ? '#D4AF37' : '#ff4444'}}></div>
                        </div>
                        <div className="interest-v-label">{stars}★</div>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="user-list">
            {data.map((person, index) => {
              const progress = calculateProgress(person.tracking);
              return (
                <div key={person.rank} className="user-card compact-card" onClick={() => { setSelectedRank(person.rank); setView('ficha'); }}>
                  <div className="user-header">
                    <div className="user-info">
                       <span className="user-rank">Posição #{index + 1}</span>
                       <h3 className="user-name">{person.name} <span style={{fontSize: '0.8rem', color: '#b4b4b4', fontWeight: '400'}}>({person.age} anos)</span></h3>
                       <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem'}}>
                         {person.tracking.acompanhador ? (
                           <span className="owner-badge inline-badge">{person.tracking.acompanhador}</span>
                         ) : (
                           <span className="owner-badge inline-badge none">Sem Dono</span>
                         )}
                         <p className="user-points" style={{margin: 0, fontSize: '0.75rem'}}>{person.score} pts</p>
                       </div>
                    </div>
                    <div className="card-actions">
                       <span className="circular-progress-mini">
                          <svg viewBox="0 0 36 36" className="circular-chart-mini gold">
                            <path className="circle-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path className="circle"
                              strokeDasharray={`${progress}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">{progress}%</text>
                          </svg>
                       </span>
                       <button className="btn-acompanhar">Acompanhar</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'ficha' && selectedRank !== null && (() => {
           const person = data.find(d => d.rank === selectedRank);
           if (!person) return null;
           const progress = calculateProgress(person.tracking);
           const team = ['Laura', 'Leonardo', 'Adney', 'Mari Raquel', 'Livia'];

           return (
             <div className="ficha-view slide-in-right">
                <button className="btn-voltar" onClick={() => setView('list')}>
                   <ArrowLeft size={20} /> Voltar
                </button>

                <div className="ficha-header-block">
                   <div className="ficha-circular-wrapper">
                      <svg viewBox="0 0 36 36" className={`circular-chart ${progress === 100 ? 'green' : 'gold'}`}>
                        <path className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                          strokeDasharray={`${progress}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="21.5" className="percentage" style={{fontSize: '0.6rem'}}>{progress}%</text>
                      </svg>
                   </div>
                   <div className="ficha-header-info">
                      <span className="user-rank" style={{fontSize: '0.9rem'}}>#{data.findIndex(d => d.rank === person.rank) + 1} Match</span>
                      <h2 style={{margin: '0.2rem 0', fontFamily: 'Playfair Display', fontSize: '2rem', color: '#D4AF37'}}>{person.name}</h2>
                      <p style={{color: '#b4b4b4', fontSize: '0.85rem', margin: 0}}>{person.age} anos • {person.score} pontos</p>

                      <a href={person.link.replace('https://wa.me/', 'https://api.whatsapp.com/send/?phone=').replace('?text=', '&text=')} target="_blank" rel="noreferrer" className="wa-btn" style={{marginTop: '0.8rem', width: 'fit-content', padding: '0.8rem 1.5rem', background: 'linear-gradient(90deg, #128C7E, #25D366)'}}>
                        <MessageSquare size={18} fill="currentColor" /> Chat WhatsApp
                      </a>
                   </div>
                </div>

                <div className="ficha-body">
                   {/* Equipes e Analytics (Dashboards) */}
                   <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                     
                     <div className="ficha-panel glow-panel" style={{borderColor: person.tracking.acompanhador ? '#D4AF37' : 'rgba(255,255,255,0.1)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                           <UserCircle size={20} color="#D4AF37" />
                           <span style={{fontWeight: '700', color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase'}}>Quem está acompanhando?</span>
                        </div>
                        <div className="team-selector">
                          {team.map(member => (
                            <button 
                              key={member}
                              className={`team-btn ${person.tracking.acompanhador === member ? 'active' : ''}`}
                              onClick={() => updateTracking(person.rank, 'acompanhador', person.tracking.acompanhador === member ? '' : member)}
                            >
                              {member}
                            </button>
                          ))}
                        </div>
                     </div>

                     {/* Analytics do Engajamento */}
                     {(() => {
                       const analytics = getAnalytics(person.tracking);
                       return (
                         <div className="ficha-panel" style={{background: 'linear-gradient(145deg, rgba(18,18,20,0.9), rgba(5,5,5,0.9))'}}>
                           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                              <span style={{fontWeight: '700', color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase'}}>Radar de Engajamento</span>
                              <span style={{fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '10px'}}>Baseado nas respostas</span>
                           </div>
                           
                           {/* Tug of war bar */}
                           <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.4rem'}}>
                             <span style={{color: '#00c864'}}>Sinais de Interesse ({analytics.intPct}%)</span>
                             <span style={{color: '#ff4444'}}>Sinais de Desinteresse ({analytics.desPct}%)</span>
                           </div>
                           <div className="analytics-tug-of-war">
                             <div className="tug-interest" style={{width: `${analytics.intPct}%`}}></div>
                             <div className="tug-resistance" style={{width: `${analytics.desPct}%`}}></div>
                           </div>

                           <div style={{marginTop: '1.2rem', textAlign: 'center'}}>
                             {analytics.intPct >= 70 ? (
                               <div className="status-pill green">💎 Lead Quente! Excelentes chances de conversão.</div>
                             ) : analytics.intPct <= 30 && analytics.desPct > 50 ? (
                               <div className="status-pill red">⚠️ Frio. Requer quebra de gelo ou oração profunda.</div>
                             ) : (
                               <div className="status-pill gold">⚖️ Em cima do muro. Precisa da sua atenção.</div>
                             )}
                           </div>
                         </div>
                       );
                     })()}

                   </div>

                   {/* Formulário Completo */}
                   <div className="user-fields">
                        
                        {/* Bloco de Anotações Livres */}
                        <div className="field-group" style={{marginBottom: '1.5rem'}}>
                          <label className="field-label" style={{color: '#fff', fontSize: '1rem'}}>📝 Anotações Livres</label>
                          <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.5rem'}}>
                            Escreva aqui o histórico, pedidos de oração ou informações importantes sobre a pessoa.
                          </span>
                          <textarea 
                            className="field-select" 
                            style={{minHeight: '100px', resize: 'vertical', paddingTop: '0.8rem', paddingBottom: '0.8rem', lineHeight: '1.4', fontFamily: 'inherit'}}
                            placeholder="Digite suas informações de acompanhamento aqui..."
                            value={person.tracking.anotacoes || ''} 
                            onChange={(e) => updateTracking(person.rank, 'anotacoes', e.target.value)}
                          />
                        </div>

                        {/* 1. O Match (Stand) */}
                        <div className="field-group">
                          <label className="field-label" style={{color: '#D4AF37', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.3rem', fontSize: '1rem'}}>
                            Fase 1: O Primeiro Contato
                          </label>
                          <label className="field-label" style={{marginTop: '0.8rem'}}>1. Aceitou o Convite de Abertura (Vigília)?</label>
                          <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                            Responder se recebeu bem o primeiro convite ou se não respondeu.
                          </span>
                          <select 
                            className="field-select" 
                            value={person.tracking.aceitouConviteVigilia || person.tracking.aceitouConvite} 
                            onChange={(e) => updateTracking(person.rank, 'aceitouConviteVigilia', e.target.value)}
                          >
                            <option value="">Selecione...</option>
                            <option value="Sim aceitou">Sim, aceitou muito bem!</option>
                            <option value="Não pode agora mas quer conhecer">Curtiu, mas não pode agora/depois</option>
                            <option value="Não respondeu">Não respondeu / Fechado</option>
                          </select>
                        </div>

                        <div className="field-group">
                          <label className="field-label">2. Conversei sinceramente com ele(a)?</label>
                          <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                            Perguntas de interesse verdadeiro, teste. Perguntei como está, onde estudava, como foi sua experiência com Deus, se já teve.
                          </span>
                          <select 
                            className="field-select" 
                            value={person.tracking.conversouBem} 
                            onChange={(e) => updateTracking(person.rank, 'conversouBem', e.target.value)}
                          >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim, fluiu e foi profundo</option>
                            <option value="Não">Não deu tempo/profundidade</option>
                            <option value="Não respondeu mt">Ele(a) não quis abrir muito</option>
                          </select>
                        </div>

                        {/* Espiritual */}
                        <div className="field-group" style={{marginTop: '0.5rem'}}>
                          <label className="field-label" style={{color: '#90caf9', borderBottom: '1px solid rgba(144,202,249,0.2)', paddingBottom: '0.3rem', fontSize: '1rem'}}>
                            Fase 2: Batalha Espiritual
                          </label>
                          <label className="field-label" style={{marginTop: '0.8rem'}}>3. Rezar uma Ave Maria por dia durante a semana por ele(a)? 🙏</label>
                          <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                            Você está rezando por essa pessoa antes do evento acontecer?
                          </span>
                          <select 
                            className="field-select" 
                            value={person.tracking.rezei} 
                            onChange={(e) => updateTracking(person.rank, 'rezei', e.target.value)}
                            style={{borderColor: person.tracking.rezei === 'Sim' ? '#90caf9' : 'rgba(255,255,255,0.1)'}}
                          >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim, estou rezando diariamente!</option>
                            <option value="Ainda não">Ainda não...</option>
                          </select>
                        </div>

                         {/* Ações Pré-Vigília */}
                         <div className="field-group" style={{marginTop: '0.5rem'}}>
                           <label className="field-label" style={{color: '#ff3c00', borderBottom: '1px solid rgba(255,60,0,0.2)', paddingBottom: '0.3rem', fontSize: '1rem'}}>
                             Fase 3: O Evento (A Vigília)
                           </label>
                           
                           <label className="field-label" style={{marginTop: '0.8rem'}}>4. 2ª Abordagem na Semana (Pré-Vigília)?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Ao conversar durante a semana e no dia do evento, ele(a) parece animado(a) para ir? Explique como foi a abordagem.
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.segundaAbordagemVigilia || person.tracking.segundaAbordagem} 
                             onChange={(e) => updateTracking(person.rank, 'segundaAbordagemVigilia', e.target.value)}
                           >
                             <option value="">Selecione...</option>
                             <option value="Sim eu falei com ela">Sim, falei e parece animado(a)</option>
                             <option value="Ela vai interessada">Ele(a) mesmo veio procurar animado(a)</option>
                             <option value="Contato frio">Falei, mas achei desanimado(a)</option>
                             <option value="Não falei ainda">Ainda não abordei a 2ª vez</option>
                           </select>
                         </div>

                         <div className="field-group">
                           <label className="field-label">5. Convidou para levar um amigo(a) com ele(a)?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Incentivou trazer mais alguém para a vigília?
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.convidarAmigo} 
                             onChange={(e) => updateTracking(person.rank, 'convidarAmigo', e.target.value)}
                           >
                             <option value="">Selecione...</option>
                             <option value="Sim ela aceitou e vai levar alguém">Sim, vai levar alguém!</option>
                             <option value="Convidei mas vai só">Convidei, mas respondeu que vai só</option>
                             <option value="Ainda não convidei">Esqueci/Não falei sobre isso</option>
                           </select>
                         </div>

                         <div className="field-group">
                           <label className="field-label">6. Precisa de ajuda para o trajeto?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Como ele vai chegar na Vigília? Alinhou carona, ônibus ou localização?
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.ajudaIda} 
                             onChange={(e) => updateTracking(person.rank, 'ajudaIda', e.target.value)}
                           >
                             <option value="">Selecione...</option>
                             <option value="Tranquilo">Não precisa, falou que chega tranquilo</option>
                             <option value="Sim">Sim, eu ajudei com o transporte</option>
                             <option value="Nao respondeu">Ele(a) nem me respondeu pra eu ajudar</option>
                           </select>
                         </div>

                         <div className="field-group" style={{padding: '0.8rem', background: 'rgba(255, 60, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 60, 0, 0.3)', marginTop: '0.5rem'}}>
                           <label className="field-label">7. FOI NA VIGÍLIA?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Confirmação oficial de presença no evento.
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.foiNaVigilia} 
                             onChange={(e) => updateTracking(person.rank, 'foiNaVigilia', e.target.value)}
                           >
                             <option value="">Selecione (Aguardando evento...)</option>
                             <option value="Sim">Sim!!! Estava lá!</option>
                             <option value="Não">Não foi :(</option>
                           </select>
                         </div>

                         {/* Fase 4: Pós Vigília (GO) */}
                         <div className="field-group" style={{marginTop: '0.5rem'}}>
                           <label className="field-label" style={{color: '#00c864', borderBottom: '1px solid rgba(0, 200, 100, 0.2)', paddingBottom: '0.3rem', fontSize: '1rem'}}>
                             Fase 4: Pós-Vigília (Grupo de Oração)
                           </label>
                           
                           <label className="field-label" style={{marginTop: '0.8rem'}}>8. Aceitou o convite para ir no Grupo de Oração?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Após a Vigília (ou caso tenha faltado, mas se manteve animado), você o chamou para o G.O.?
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.aceitouGO || person.tracking.grupoDeOracao} 
                             onChange={(e) => updateTracking(person.rank, 'aceitouGO', e.target.value)}
                           >
                             <option value="">Selecione...</option>
                             <option value="Sim">Sim, quer muito ir!</option>
                             <option value="Ainda vai pensar">Ainda vai analisar os dias/horários</option>
                             <option value="Não">Não, se fechou ou recusou</option>
                           </select>
                         </div>

                         <div className="field-group">
                           <label className="field-label">9. 2ª Abordagem na Semana (Pré-G.O.)?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Você continuou puxando assunto ou animando ao longo da semana do Grupo?
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.segundaAbordagemGO} 
                             onChange={(e) => updateTracking(person.rank, 'segundaAbordagemGO', e.target.value)}
                           >
                             <option value="">Selecione...</option>
                             <option value="Falei animado">Falei e está super na expectativa</option>
                             <option value="Sem resposta">Falei, mas me deu vácuo/frio</option>
                             <option value="Nao falei">Ainda não mandei essa mensagem</option>
                           </select>
                         </div>

                         <div className="field-group" style={{padding: '0.8rem', background: 'rgba(0, 200, 100, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 200, 100, 0.3)', marginTop: '0.5rem', marginBottom: '1rem'}}>
                           <label className="field-label">10. FOI NO GRUPO DE ORAÇÃO?</label>
                           <span style={{fontSize: '0.75rem', color: '#b4b4b4', marginBottom: '0.3rem'}}>
                             Último passo e engajamento da pessoa na Obra local.
                           </span>
                           <select 
                             className="field-select" 
                             value={person.tracking.foiNoGO} 
                             onChange={(e) => updateTracking(person.rank, 'foiNoGO', e.target.value)}
                           >
                             <option value="">Selecione (Aguardando G.O...)</option>
                             <option value="Sim">Sim!!! Engajou!</option>
                             <option value="Não">Não apareceu :(</option>
                           </select>
                         </div>

                        {/* Gráfico de Interesse do Jovem 🔥 */}
                        <div className="field-group" style={{marginTop: '0.5rem', marginBottom: '0.5rem'}}>
                          <label className="field-label" style={{color: '#D4AF37', fontSize: '1.2rem', textAlign: 'center'}}>GRÁFICO FINAL DO JOVEM</label>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold'}}>
                               <span style={{color: '#ff4444'}}>1★ Frio</span>
                               <span style={{color: '#D4AF37'}}>3★ Pensando</span>
                               <span style={{color: '#00c864'}}>5★ Fervendo!</span>
                            </div>
                            <div className="card-track" style={{height: '10px', marginTop: '0.2rem', marginBottom: '0.5rem'}}>
                               <div className="card-fill" style={{
                                 width: `${(person.tracking.interesse || 0) * 20}%`, 
                                 background: person.tracking.interesse <= 2 ? '#ff4444' : person.tracking.interesse === 3 ? '#D4AF37' : '#00c864',
                                 boxShadow: '0 0 8px currentColor'
                               }}></div>
                            </div>
                            <div className="interest-rating" style={{justifyContent: 'space-between'}}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  key={star}
                                  className={`star-btn ${person.tracking.interesse >= star ? 'active' : ''}`}
                                  onClick={() => updateTracking(person.rank, 'interesse', star)}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                   </div>
                </div>
             </div>
           );
        })()}
      </div>
    </div>
  );
}
