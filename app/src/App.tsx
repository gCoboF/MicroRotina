import { useEffect, useState } from 'react';
import { today, useStore } from './state';
import { useRoute } from './router';
import { Agreements, Lock, PinSetup, ProfileStart, Welcome } from './screens/Onboarding';
import { Accessibility } from './screens/Accessibility';
import { Ideas, NewHabit } from './screens/NewHabit';
import { AllDone, CheckIn, HardDay, NotFound, Rest, Today, Water } from './screens/Today';
import { DeleteHabit, HabitDetail, MyHabits, Reminder } from './screens/Habits';
import { Progress } from './screens/Progress';
import { Erase, Export, Language, Profile, Reminders, SettingsHome, Sync, SyncOn, Transparency } from './screens/Settings';

export default function App() {
  const { s } = useStore();
  const [r0, r1] = useRoute();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('microrotina:unlocked') === '1');
  useEffect(() => {
    const on = () => setUnlocked(true);
    window.addEventListener('unlock', on);
    return () => window.removeEventListener('unlock', on);
  }, []);

  if (s.pin && s.onboarded && !unlocked) return <Lock />;

  switch (r0) {
    case undefined:
      if (!s.onboarded) return <Welcome />;
      return s.energy[today()] ? <Today /> : <CheckIn />;
    case 'combinados': return <Agreements />;
    case 'perfil-inicio': return <ProfileStart />;
    case 'pin': return <PinSetup />;
    case 'acessibilidade-inicio': return <Accessibility onboarding />;
    case 'acessibilidade': return <Accessibility onboarding={false} />;
    case 'novo': return <NewHabit step={Number(r1) || 1} />;
    case 'ideias': return <Ideas />;
    case 'checkin': return <CheckIn />;
    case 'hoje': return <Today />;
    case 'agua': return <Water id={r1} />;
    case 'tudo-feito': return <AllDone />;
    case 'dificil': return <HardDay />;
    case 'descanso': return <Rest />;
    case 'habitos': return <MyHabits />;
    case 'habito': return <HabitDetail id={r1} />;
    case 'excluir': return <DeleteHabit id={r1} />;
    case 'lembrete': return <Reminder id={r1} />;
    case 'lembretes': return <Reminders />;
    case 'progresso': return <Progress />;
    case 'ajustes': return <SettingsHome />;
    case 'perfil': return <Profile />;
    case 'idioma': return <Language />;
    case 'transparencia': return <Transparency />;
    case 'exportar': return <Export />;
    case 'apagar': return <Erase />;
    case 'sync': return <Sync />;
    case 'sync-ligado': return <SyncOn />;
    default: return <NotFound />;
  }
}
