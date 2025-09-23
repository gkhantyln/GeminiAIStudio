# AI Image Studio (Yapay Zeka Görüntü Stüdyosu)

![AI Image Studio Arayüzü](https://picsum.photos/1200/600?random=1) <!-- Placeholder - Gerçek bir ekran görüntüsü ile değiştirin -->

**AI Image Studio**, Google'ın güçlü **Gemini API**'sini kullanarak çok çeşitli görüntü ve video düzenleme görevlerini gerçekleştiren modern bir web uygulamasıdır. Kullanıcıların yaratıcılıklarını ortaya çıkarmalarını sağlayan sezgisel bir arayüzle, profesyonel kalitede sonuçlar elde etmek artık çok kolay.

Uygulama, Türkçe ve İngilizce dil desteği sunmaktadır.

## ✨ Özellikler

Bu uygulama, her biri belirli bir görev için özelleştirilmiş 15 farklı yapay zeka aracı sunar:

-   **🎬 Yapay Zeka Video Oluşturucu:** Metin açıklamaları ve isteğe bağlı başlangıç görselleriyle kısa videolar oluşturun. Farklı en-boy oranları (16:9, 9:16 vb.) desteklenir.
-   **🎭 Yüz Değiştirme (Face Swap):** İki görüntü arasında yüzleri kusursuz bir şekilde değiştirin.
-   **🖼️ Fotoğraf Birleştirici (Image Mixer):** Birden fazla fotoğrafı birleştirerek tamamen yeni ve tutarlı bir sahne yaratın.
-   **👑 Sanal Deneme (Virtual Try-On):** Takı, gözlük veya şapka gibi aksesuarları bir model üzerinde sanal olarak deneyin.
-   **🚀 Görüntü İyileştirici (Image Enhancer):** Fotoğraflarınızın çözünürlüğünü, netliğini ve renklerini iyileştirin.
-   **🎨 Fotoğraf Renklendirme (Colorize Photo):** Siyah beyaz fotoğraflara canlı ve gerçekçi renkler ekleyin.
-   **🪄 Sihirli Silgi (Magic Eraser):** Fırça ile boyayarak fotoğraflarınızdaki istenmeyen nesneleri, kişileri veya kusurları kolayca kaldırın.
-   **↔️ Sihirli Genişletme (Magic Expand):** Fotoğraflarınızın sınırlarını yapay zeka ile genişleterek sahneyi doğal bir şekilde devam ettirin.
-   **👕 Kıyafet Değiştirici (Outfit Changer):** Bir metin açıklaması veya referans bir görüntü ile bir kişinin kıyafetini değiştirin.
-   **🔄 Kıyafet Aktarma (Outfit Transfer):** Bir fotoğraftaki kıyafeti başka bir fotoğraftaki kişiye giydirin.
-   **🏞️ Arka Plan Değiştirme (Background Swap):** Bir konuyu mevcut arka planından ayırıp tamamen yeni bir sahneye yerleştirin.
-   **🛋️ Yapay Zeka İç Mimar (AI Interior Designer):** Bir odanın fotoğrafını yükleyin ve metin komutlarıyla yeniden dekore edin (örneğin, "duvarları maviye boya, modern bir kanepe ekle").
-   **👨‍💼 Yapay Zeka Vesikalık (AI Headshot Generator):** Sıradan bir selfie'yi profesyonel bir vesikalık fotoğrafa dönüştürün.
-   **📦 Yapay Zeka Ürün Fotoğrafçısı (AI Product Photographer):** Ürününüzün fotoğrafını yükleyin ve onu stüdyo kalitesinde, dikkat çekici bir arka plana yerleştirin.
-   **✍️ Özel Düzenleme (Custom Edit):** Ne istediğinizi kelimelerle anlatın, yapay zeka sizin için düzenlemeyi yapsın.

## 🛠️ Kullanılan Teknolojiler

-   **Yapay Zeka Motoru:** Google Gemini API
    -   Görüntü Modeli: `gemini-2.5-flash-image-preview`
    -   Video Modeli: `veo-2.0-generate-001`
-   **Frontend:**
    -   [React](https://reactjs.org/)
    -   [TypeScript](https://www.typescriptlang.org/)
-   **Styling:**
    -   [Tailwind CSS](https://tailwindcss.com/)
-   **Dil Desteği (i18n):** React Context API ile özel çözüm

## 🚀 Kurulum ve Başlatma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/kullanici-adiniz/ai-image-studio.git
    cd ai-image-studio
    ```

2.  **Google Gemini API Anahtarı Alın:**
    -   Uygulamanın çalışması için bir Google Gemini API anahtarına ihtiyacınız var.
    -   [Google AI Studio](https://aistudio.google.com/app/apikey) adresine gidin ve ücretsiz bir API anahtarı oluşturun.

3.  **Uygulamayı Çalıştırın:**
    -   Bu proje, harici kütüphaneleri bir `importmap` ile CDN üzerinden yüklediği için `npm install` gibi bir adıma ihtiyaç duymaz.
    -   Proje dosyalarını bir yerel sunucu ile sunmanız yeterlidir. Örneğin, [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) eklentisini kullanabilir veya `http-server` gibi bir paket kurabilirsiniz:
    ```bash
    # npm ile http-server yükleyin (eğer yüklü değilse)
    npm install -g http-server

    # Proje kök dizininde sunucuyu başlatın
    http-server
    ```
    -   Tarayıcınızda açılan adrese gidin (genellikle `http://localhost:8080`).

## 📖 Kullanım

1.  Uygulamayı tarayıcınızda açtığınızda bir giriş ekranı sizi karşılayacaktır.
2.  Google AI Studio'dan aldığınız Gemini API anahtarınızı ilgili alana yapıştırın ve "Giriş Yap" butonuna tıklayın.
3.  Ana menüden kullanmak istediğiniz aracı seçin.
4.  Seçtiğiniz aracın talimatlarını izleyin (görüntü yükleme, metin girme vb.).
5.  Sonucu oluşturmak için ilgili butona tıklayın ve yapay zekanın sihrini tamamlamasını bekleyin.
6.  Oluşturulan sonucu indirebilir veya yeni bir işlem için başa dönebilirsiniz.

## 🤝 Katkıda Bulunma

Katkılarınız projeyi daha iyi hale getirmemize yardımcı olur! Katkıda bulunmak için lütfen şu adımları izleyin:

1.  Bu repoyu **fork**'layın.
2.  Yeni bir **branch** oluşturun (`git checkout -b ozellik/yeni-bir-ozellik`).
3.  Değişikliklerinizi yapın ve **commit**'leyin (`git commit -m 'Yeni bir özellik eklendi'`).
4.  Branch'inizi **push**'layın (`git push origin ozellik/yeni-bir-ozellik`).
5.  Bir **Pull Request** açın.

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.
