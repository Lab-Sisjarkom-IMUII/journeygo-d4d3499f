import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, duration, people, style, type = 'recommendation' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API Key tidak dikonfigurasi');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'recommendation') {
      systemPrompt = `Kamu adalah Travel Planner AI profesional yang ahli dalam merencanakan liburan.
Berikan rekomendasi dalam format JSON dengan struktur berikut:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Hari 1: Tiba & Eksplorasi Awal",
      "activities": [
        {
          "time": "Pagi (09:00 - 12:00)",
          "location": "Nama Tempat",
          "activity": "Deskripsi aktivitas detail",
          "estimatedCost": 100000,
          "coordinates": [longitude, latitude]
        },
        {
          "time": "Siang (12:00 - 15:00)",
          "location": "Nama Tempat",
          "activity": "Deskripsi aktivitas detail",
          "estimatedCost": 50000,
          "coordinates": [longitude, latitude]
        },
        {
          "time": "Sore (15:00 - 18:00)",
          "location": "Nama Tempat",
          "activity": "Deskripsi aktivitas detail",
          "estimatedCost": 75000,
          "coordinates": [longitude, latitude]
        },
        {
          "time": "Malam (18:00 - 22:00)",
          "location": "Nama Tempat",
          "activity": "Deskripsi aktivitas detail",
          "estimatedCost": 150000,
          "coordinates": [longitude, latitude]
        }
      ],
      "dayTotal": 375000
    }
  ],
  "costBreakdown": {
    "transportation": 2000000,
    "accommodation": 3500000,
    "food": 1500000,
    "activities": 1000000,
    "total": 8000000
  },
  "tips": [
    "Tip perjalanan spesifik 1",
    "Tip perjalanan spesifik 2",
    "Tip perjalanan spesifik 3"
  ],
  "localFood": [
    "Rekomendasi kuliner lokal 1",
    "Rekomendasi kuliner lokal 2",
    "Rekomendasi kuliner lokal 3"
  ],
  "uniqueActivities": [
    "Aktivitas unik & menarik 1",
    "Aktivitas unik & menarik 2"
  ],
  "alternatives": [
    {
      "destination": "Nama Destinasi Alternatif",
      "estimatedCost": 5000000,
      "reason": "Alasan mengapa alternatif ini menarik dan cocok"
    }
  ]
}

PENTING: 
- Berikan koordinat GPS yang akurat untuk setiap lokasi dalam format [longitude, latitude]
- Buat itinerary yang DETAIL dan KOMUNIKATIF untuk setiap waktu (Pagi, Siang, Sore, Malam)
- Estimasi biaya harus realistis dalam Rupiah
- Sesuaikan rekomendasi dengan gaya liburan yang dipilih`;

      userPrompt = `Pengguna ingin berlibur ke ${destination} selama ${duration} hari untuk ${people} orang, dengan gaya liburan ${style}.
      
Gaya liburan:
- Hemat: budget minimal, hostel/penginapan murah, makanan lokal, transportasi umum
- Standar: budget menengah, hotel 3 bintang, mix antara restoran dan warung, transportasi campuran
- Premium: budget tinggi, hotel 4-5 bintang, restoran bagus, transportasi private

Buatkan itinerary yang DETAIL dalam format rundown per hari seperti ini:

🗓️ Hari 1: [Judul Hari]
- Pagi (09:00 - 12:00): [Aktivitas detail]
- Siang (12:00 - 15:00): [Aktivitas detail]
- Sore (15:00 - 18:00): [Aktivitas detail]
- Malam (18:00 - 22:00): [Aktivitas detail]
💰 Estimasi biaya hari ini: Rp...

Lakukan hal yang sama untuk semua ${duration} hari.

Akhiri dengan:
• Total estimasi biaya keseluruhan (breakdown: transportasi, akomodasi, makanan, aktivitas)
• Rekomendasi kuliner lokal yang wajib dicoba
• Aktivitas unik & menarik di destinasi ini
• Tips perjalanan sesuai gaya liburan
• Alternatif destinasi serupa

Berikan rekomendasi lengkap dalam format JSON yang rapi, komunikatif, dan mudah dibaca.`;
    } else if (type === 'suggestion') {
      systemPrompt = `Kamu adalah AI assistant yang memberikan saran destinasi berdasarkan preferensi user.
Berikan 3 rekomendasi destinasi dalam format JSON:
{
  "suggestions": [
    {
      "destination": "Nama Destinasi",
      "estimatedCost": 5000000,
      "duration": 3,
      "reason": "Alasan mengapa cocok dengan preferensi user",
      "highlights": ["Highlight 1", "Highlight 2"]
    }
  ]
}`;

      userPrompt = `User memiliki preferensi gaya liburan: ${style}.
Berikan 3 rekomendasi destinasi menarik di Indonesia yang sesuai dengan budget dan gaya tersebut.`;
    }

    let retryCount = 0;
    let response;
    
    while (retryCount < 2) {
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
          }),
        });

        if (response.ok) {
          break;
        }
        
        retryCount++;
        if (retryCount < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        retryCount++;
        if (retryCount >= 2) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!response || !response.ok) {
      const errorText = await response?.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Gagal mendapatkan rekomendasi dari AI');
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-travel-recommendation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses permintaan';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        retry: true
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
