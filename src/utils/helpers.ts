export const Hex2Rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const shortenPublicKey = (publicKey: string, len?: number) => {
    try {
        if (len) {
            return publicKey.slice(0, len)
        }
        return publicKey.slice(0, 5) + "..." + publicKey.slice(-5);
    } catch (e) {
        return publicKey;
    }
}

export const downsampleData = <T>(data: T[]): T[] => {
    if (data.length <= 2) {
      // If the data is too small, return the original data
      return data;
    }
  
    const downsampled: T[] = [data[0]]; // Start with the first item
  
    // Loop through data, starting from the second item and ending before the last item
    for (let i = 1; i < data.length - 1; i += 5) {
      downsampled.push(data[i]);
    }
  
    downsampled.push(data[data.length - 1]); // Ensure the last item is included
  
    return downsampled;
  };

  export interface CollectionDetailsType {
    logoSrc: string;
    name: string;
    supply: string;
    website: string;
    twitter: string;
    discord: string;
    backgroundImageSrc: string;
    mintDate: string; // Assuming date is a string, adjust as needed
    mintPrice: string; // Assuming price is a string, adjust as needed
    address: string; // Assuming this is a blockchain address or similar
  }

  // A mapping from collection slug to details
  export const collectionMapping: Record<string, CollectionDetailsType> = {
    "astroguys": {
      logoSrc: "https://static-assets.pallet.exchange/collections/pfp/sei1ezqkre4j3gkxlfhc23zv7w4nz8guwyczu70w650008dv3yscj2pqky7x7g_pfp.png",
      name: "Astro Guys",
      supply: "2,500",
      website: "https://www.astrohub.io/",
      twitter: "https://twitter.com/AstroGuys_sei",
      discord: "https://discord.com/invite/astroguys",
      backgroundImageSrc: "https://static-assets.pallet.exchange/collections/banners/sei1ezqkre4j3gkxlfhc23zv7w4nz8guwyczu70w650008dv3yscj2pqky7x7g_banner.png",
      mintDate: "1/29/2024",
      mintPrice: "25 SEI",
      address: "sei1ezqkre4j3gkxlfhc23zv7w4nz8guwyczu70w650008dv3yscj2pqky7x7g",
    },
    "bullsonsei": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/bullsonsei.png",
        name: "Bulls on SEI",
        supply: "1,500",
        website: "https://www.bullsonsei.com/",
        twitter: "https://twitter.com/BullsonSEI",
        discord: "https://discord.com/invite/RuyUgVMt9m",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/bullsonsei.png",
        mintDate: "1/18/2024",
        mintPrice: "Free",
        address: "sei1u64thag5ltz7sjte7ggdd0k8wzr59p32vlswh89wswmz46relcqq6my5h6",
    },
    "cappys": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/cappys_pfp.png",
        name: "Cappys",
        supply: "10,000",
        website: "https://linktr.ee/cappysonsei",
        twitter: "https://twitter.com/CappysNFT",
        discord: "https://discord.com/invite/cappysnft",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/cappys_banner.png",
        mintDate: "2/8/2024",
        mintPrice: "165 SEI",
        address: "sei1cujl8ujhc36lp7sr98x30u0aeqtjlj68kll5rqqr9dke5xvn2ltquzhysl",
    },
    "cryptomonos": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp/sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl_pfp.png",
        name: "CryptoMonos",
        supply: "6,900",
        website: "https://www.cryptomonos.com/",
        twitter: "https://twitter.com/CryptoMonosNFT",
        discord: "https://discord.com/invite/4aFqc8c4ZD",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/banners/sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl_banner.gif",
        mintDate: "2/29/2024",
        mintPrice: "Free",
        address: "sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl",
    },
    "dob": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/dob.png",
        name: "dob",
        supply: "5,555",
        website: "https://dobnfts.xyz/",
        twitter: "https://twitter.com/dobnfts",
        discord: "https://discord.com/invite/dobnfts",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/dob.png",
        mintDate: "1/10/2024",
        mintPrice: "40 SEI",
        address: "sei13zrt6ts27fd7rl3hfha7t63udghm0d904ds68h5wsvkkx5md9jqqkd7z5j",
    },
    "fudfoxes": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei12y9v6h9jsqhamxgy79hfs9703flt62a46t7fgpqsjnfqzr2ep3kq8wuxf7_pfp.PNG",
        name: "Fud Foxes",
        supply: "3,332",
        website: "https://seimywallet.xyz/",
        twitter: "https://twitter.com/fudfoxes",
        discord: "https://discord.com/invite/fudfoxes",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei12y9v6h9jsqhamxgy79hfs9703flt62a46t7fgpqsjnfqzr2ep3kq8wuxf7_banner.png",
        mintDate: "2/16/2024",
        mintPrice: "Free",
        address: "sei12y9v6h9jsqhamxgy79hfs9703flt62a46t7fgpqsjnfqzr2ep3kq8wuxf7",
    },
    "ghosty": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1svkamkuklth3wls08wt596q2dykf6j55tnnw7rsh5675fsfpj40sjdhn00_pfp.png",
        name: "Ghosty",
        supply: "3,333",
        website: "https://www.ghosty.chat/",
        twitter: "https://twitter.com/GhostyChat",
        discord: "https://discord.com/invite/ghostychat",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1svkamkuklth3wls08wt596q2dykf6j55tnnw7rsh5675fsfpj40sjdhn00_banner.png",
        mintDate: "2/14/2024",
        mintPrice: "50 SEI",
        address: "sei1svkamkuklth3wls08wt596q2dykf6j55tnnw7rsh5675fsfpj40sjdhn00",
    },
    "grapesonsei": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/grapes_pfp.png",
        name: "Grapes on Sei",
        supply: "5,000",
        website: "https://grapes.gg/",
        twitter: "https://twitter.com/GrapesSEI",
        discord: "https://discord.com/invite/grapesonsei",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/grapes_banner.png",
        mintDate: "2/19/2024",
        mintPrice: "Free",
        address: "sei1ej9hps3dgyxcuxqdcfqst5tjmmpxndn9effgf56kznch0fqxmnmqy250tz",
    },
    "qunks": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1vu4nmwptp3y4dtt8wnsfd2kt9gw38fwp4sjn33u06ydyzjy5p92q76xuy9_pfp.png",
        name: "QUNKS",
        supply: "3,333",
        website: "https://www.duub.ca/collectibles",
        twitter: "https://twitter.com/qunks_sei",
        discord: "https://discord.gg/4eZdPHqpcg",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1vu4nmwptp3y4dtt8wnsfd2kt9gw38fwp4sjn33u06ydyzjy5p92q76xuy9_banner.png",
        mintDate: "2/22/2024",
        mintPrice: "39 SEI",
        address: "sei1vu4nmwptp3y4dtt8wnsfd2kt9gw38fwp4sjn33u06ydyzjy5p92q76xuy9",
    },
    "remosworld": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1dr8skknjpn58lnneqw6ahmnddzgl0veyteld0p73f6zzm52r38gs3e3mrd_pfp.png",
        name: "REMO's World",
        supply: "5,555",
        website: "https://www.remosworld.xyz/",
        twitter: "https://twitter.com/Remosworld",
        discord: "https://discord.com/invite/kWZbbNTzHf",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1dr8skknjpn58lnneqw6ahmnddzgl0veyteld0p73f6zzm52r38gs3e3mrd_banner.png",
        mintDate: "1/31/2024",
        mintPrice: "Free",
        address: "sei1dr8skknjpn58lnneqw6ahmnddzgl0veyteld0p73f6zzm52r38gs3e3mrd",
    },
    "seimen": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1cnktx4rr8mlyr09hw3u4l8vrrpv6qtght3zcdpzhlf29fq2enluqlpndct_pfp.png",
        name: "SEIMEN",
        supply: "4,444",
        website: "https://app.kryptonite.finance/",
        twitter: "https://twitter.com/Kryptonite_fi",
        discord: "https://discord.com/invite/kryptonite-fi",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1cnktx4rr8mlyr09hw3u4l8vrrpv6qtght3zcdpzhlf29fq2enluqlpndct_banner.png",
        mintDate: "2/3/2024",
        mintPrice: "100 SEI",
        address: "sei1cnktx4rr8mlyr09hw3u4l8vrrpv6qtght3zcdpzhlf29fq2enluqlpndct",
    },
    "seimurai": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/seimurai.png",
        name: "Seimurai",
        supply: "3,333",
        website: "https://seimurai.club/",
        twitter: "https://twitter.com/SeimuraiSEI",
        discord: "https://discord.com/invite/seimurai",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/seimurai.png",
        mintDate: "1/20/2024",
        mintPrice: "15 SEI",
        address: "sei1atcfjjz779ynmlek4tqh47ssrwge0mhlauyr637wdjkrhtfqdjqqtlcwhl",
    },
    "seitoshis": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1s45l507j760qj34w60rvgrtpcg2mln99tyw7ta9pw9azkt0eavdskszx2e_pfp.png",
        name: "Seitoshis",
        supply: "3,333",
        website: "https://side.xyz/seitoshis",
        twitter: "https://twitter.com/seitoshi_nft",
        discord: "https://discord.com/invite/seitoshis",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei1s45l507j760qj34w60rvgrtpcg2mln99tyw7ta9pw9azkt0eavdskszx2e_banner.png",
        mintDate: "2/3/2024",
        mintPrice: "Free",
        address: "sei1s45l507j760qj34w60rvgrtpcg2mln99tyw7ta9pw9azkt0eavdskszx2e",
    },
    "seiyans": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/seiyans.png",
        name: "Seiyans",
        supply: "9,001",
        website: "https://linktr.ee/seiyans",
        twitter: "https://twitter.com/seiyansnft",
        discord: "https://discord.com/invite/7sNZYGdDgX",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/seiyans.png",
        mintDate: "12/29/2023",
        mintPrice: "Free",
        address: "sei1g2a0q3tddzs7vf7lk45c2tgufsaqerxmsdr2cprth3mjtuqxm60qdmravc",
    },
    "thecolony": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/colony-test.jpeg",
        name: "The Colony",
        supply: "5,555",
        website: "",
        twitter: "https://twitter.com/thecolonynft__",
        discord: "https://discord.com/invite/TyDDa2j5dp",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/colony3.jpg",
        mintDate: "9/19/2023",
        mintPrice: "Free",
        address: "sei1pkteljh83a83gmazcvam474f7dwt9wzcyqcf5puxvqqs6jcx8nnq2y74lu",
    },
    "thecouncil": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei16hcvgfft2l2wf3h2c3wufekp05g0zf9gd32f3gtg9g7vpmw8hjxsy7z0pd_pfp.jpg",
        name: "The Council",
        supply: "2,920",
        website: "https://www.thecouncil.wtf/",
        twitter: "https://twitter.com/TheCouncilSEI",
        discord: "https://discord.com/invite/thecouncilsei",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei16hcvgfft2l2wf3h2c3wufekp05g0zf9gd32f3gtg9g7vpmw8hjxsy7z0pd_banner.png",
        mintDate: "2/15/2024",
        mintPrice: "Free",
        address: "sei16hcvgfft2l2wf3h2c3wufekp05g0zf9gd32f3gtg9g7vpmw8hjxsy7z0pd",
    },
    "therabbitproject": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/rabbit_pfp.png",
        name: "The Rabbit Project",
        supply: "5,555",
        website: "https://rabbit.game/",
        twitter: "https://twitter.com/RabbitsOnSei",
        discord: "https://discord.com/invite/rabbitsonsei",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/rabbit_banner.jpeg",
        mintDate: "2/5/2024",
        mintPrice: "200 SEI",
        address: "sei1vpad5n0m6a0he83mcgp33uem43vst2nykp2nrzkmv57mkgm64a5qlf9ac3",
    },
    "theunfrgtn": {
        logoSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei130chx0wxkzela4s8urydadjkwrlwms22ad8jq7rcmsv2pme4mljq0sw998_pfp.jpg",
        name: "The Unfrgtn",
        supply: "3,333",
        website: "https://app.unfrgtn.space/auth/signin",
        twitter: "https://twitter.com/UnfrgtnOrbit",
        discord: "https://discord.com/invite/U2RQ8tZvV9",
        backgroundImageSrc: "https://static-assets.pallet.exchange/collections/pfp_banners/sei130chx0wxkzela4s8urydadjkwrlwms22ad8jq7rcmsv2pme4mljq0sw998_banner.png",
        mintDate: "2/4/2024",
        mintPrice: "33 SEI",
        address: "sei130chx0wxkzela4s8urydadjkwrlwms22ad8jq7rcmsv2pme4mljq0sw998",
    },
    "webump": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/webump.jpg",
        name: "WeBump",
        supply: "4,444",
        website: "https://webump.xyz/",
        twitter: "https://twitter.com/webump_",
        discord: "https://discord.com/invite/m2WEtFRY8q",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/webump.png",
        mintDate: "12/27/2023",
        mintPrice: "99 SEI",
        address: "sei1v90ly54qeu7497lzk2mnmp2h29sgtep8hs5ryvfqf8dwq5gc0t9srp6aey",
    },
    "yakavoyager": {
        logoSrc: "https://static-assets.pallet.exchange/pfp/yakavoyager.png",
        name: "Yaka Voyager",
        supply: "2,000",
        website: "https://app.yaka.finance/#/swap",
        twitter: "https://twitter.com/YakaFinance",
        discord: "https://discord.com/invite/BXrv66m3Dr",
        backgroundImageSrc: "https://static-assets.pallet.exchange/banner/yakavoyager.png",
        mintDate: "1/30/2024",
        mintPrice: "150 SEI",
        address: "sei1wzhrqprfpxagkrxz9fspmnrtc0fqusk5g6ynpezcl705sfqs55nqscej0k",
    }
  };