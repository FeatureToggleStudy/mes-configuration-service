import { Mock, It, Times } from 'typemoq';
import * as testPermissionRepo from '../../framework/test-permission-repository';
import { TestPermissionPeriod } from '../config.model';
import { buildConfig } from '../config-builder';

describe('ConfigBuilder', () => {
  const moqTestPermissionRepo = Mock.ofInstance(testPermissionRepo.getTestPermissionPeriods);

  beforeEach(() => {
    moqTestPermissionRepo.reset();

    spyOn(testPermissionRepo, 'getTestPermissionPeriods').and.callFake(moqTestPermissionRepo.object);
  });

  describe('buildConfig', () => {
    it('should put the examiners TestPermissionPeriods into the config model', async () => {
      const fakePermissions: TestPermissionPeriod[] = [
        {
          category: 'B',
          from: '2019-08-01',
          to: '2019-08-20',
        },
        {
          category: 'B',
          from: '2019-12-01',
          to: null,
        },
      ];
      moqTestPermissionRepo.setup(x => x(It.isAny())).returns(() => Promise.resolve(fakePermissions));

      const result = await buildConfig('999');

      expect(result.journal.testPermissionPeriods).toBe(fakePermissions);
      moqTestPermissionRepo.verify(x => x(It.isValue('999')), Times.once());
    });
  });
});