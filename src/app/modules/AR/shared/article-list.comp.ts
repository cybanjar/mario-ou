import { ref, onMounted } from '@vue/composition-api';
import { ResArtikelList } from '../models/payment.model';
import { reformArticle } from '../utils/getTableData';

const PRELOD_ARTICLES = [];

type Option<T> = {
  value: T;
  label: string;
};

export function loadArticleList(
  $api,
  caseType = '13',
  prefetch = false,
  global = false
) {
  const articleOptions = ref<Option<number>[]>([]);
  const isPrefetch = ref(false);

  onMounted(async () => {
    if (prefetch === false || PRELOD_ARTICLES.length === 0) {
      isPrefetch.value = false;
      const requestEndpoint = global
        ? $api.accountReceivable.getReadArticleCoreList
        : $api.accountReceivable.getReadArticleList;

      const articleList = await requestEndpoint({
        caseType,
        dept: 0,
        actFlag: true,
      });

      articleOptions.value = reformArticle(articleList);

      isPrefetch.value = true;
    }
  });

  return {
    articleOptions,
    isPrefetch,
  };
}
