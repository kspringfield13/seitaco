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