import { Component } from '@angular/core';
import { TeamMember } from '../../interfaces/team-members';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  members: TeamMember[] = [
    {
      name: 'Fernanda Rosário',
      img: 'content/team/fernanda-rosario.min.jpg',
      imghigh: 'content/team/fernanda-rosario.jpg',
      knowMore: 'https://fernandapfrosario.journoportfolio.com',
      intro: `Jornalista com atuação em projetos pautados na temática racial, direitos
              humanos, combate ao racismo, meio ambiente, educação midiática e
              diversidade.
              Já teve materiais publicados (entre textos, vídeos,
              podcasts e apresentação de programa) na Alma Preta Jornalismo, Folha de
              São Paulo, UOL, Portal Terra, TV Unesp e Canal Futura. Recebeu o 3°
              lugar no Prêmio 99 de Jornalismo com a matéria "Apps ajudam no
              deslocamento e dão autonomia para pessoas com deficiência", publicada na
              Folha de São Paulo e desenvolvida durante o Laboratório 99+Folha de SP,
              em que foi trainee em 2020 e 2021.
              Ficou em 2° lugar na mesma premiação com o podcast "Dinheiro para Todos: Bancarização e Soluções Digitais" em
              2021, publicado também na Folha de São Paulo. Fez parte da equipe de
              construção do "Manual de Redação: O jornalismo antirracista a partir da
              experiência da Alma Preta", que recupera e homenageia também quase 2
              séculos de imprensa negra no Brasil.
                Nos últimos anos, desenvolve trabalhos em assessoria de imprensa,
              social media e desenvolvimento de textos diversos, como e-books e newsletters, além de
              assistência de direção de documentário.`
    },
  ];
}
