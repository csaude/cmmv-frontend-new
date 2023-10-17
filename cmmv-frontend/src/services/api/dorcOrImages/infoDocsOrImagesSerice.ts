import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import InfoDocsOrImages from 'src/stores/models/dorcOrImages/InfoDocsOrImages';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const infoDocsOrImages = useRepo(InfoDocsOrImages);

const { alertSucess, alertError } = useSwal();
const { isMobile, isOnline } = useSystemUtils();
