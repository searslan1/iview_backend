import { Request, Response } from 'express';
import { uploadVideo } from '../service/video.service';
import { Candidate } from '../models/candidate.schema';



export const uploadVideoController = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file; // Multer ile gelen dosya
        const formId = req.body.formId; // formId frontend'den gelecek ve candidate ID olacak

        if (!file || !formId) {
            res.status(400).send('Dosya veya Form ID eksik.');
            return;
        }

        // formId ile Candidate'i bul
        const candidate = await Candidate.findById(formId);
        if (!candidate) {
            res.status(404).send('Aday bulunamadı.');
            return;
        }

        // Service katmanına dosya ve formId'yi (candidateId) ilet
        const fileName = await uploadVideo(file, formId);  // Yalnızca dosya adı döner

        // Candidate'in video URL'sini (dosya adı olarak) güncelle
        candidate.videoUrl = fileName;  // Sadece dosya adı kaydedilir
        await candidate.save(); // Adayın bilgilerini güncelle

        res.status(200).json({ message: "Video başarıyla yüklendi" });  // Sadece mesaj dönülür, URL dönülmez
    } catch (err) {
        res.status(500).send((err as Error).message);
    }
    
};