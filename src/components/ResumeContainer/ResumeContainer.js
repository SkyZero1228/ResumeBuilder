import Icon from '../Icon/Icon.vue';
import TextInput from '../TextInput/TextInput.vue';
import PersonalInformation from './sections/PersonalInformation/PersonalInformation.vue';
import ProfessionalSummary from './sections/ProfessionalSummary/ProfessionalSummary.vue';
import TestScores from './sections/TestScores/TestScores.vue';
import Skills from './sections/Skills/Skills.vue';
import Courses from './sections/Courses/Courses.vue';
import Education from './sections/Education/Education.vue';
import Employment from './sections/Employment/Employment.vue';
import ExtraCurricular from './sections/ExtraCurriculars/ExtraCurriculars.vue';
import SocialLinks from './sections/SocialLinks/SocialLinks.vue';
import Hobbies from './sections/Hobbies/Hobbies.vue';
import Internships from './sections/Internships/Internships.vue';
import Languages from './sections/Languages/Languages.vue';
import References from './sections/References/References.vue';
import Custom from './sections/Custom/Custom.vue';
import DefaultResumeTemplate from '../../resumeTemplates/default/template.vue';

const sectionsMap = {
  Courses,
  Education,
  Employment,
  ExtraCurricular,
  Hobbies,
  Internships,
  Languages,
  References,
  Skills,
  SocialLinks,
  Custom,
  TestScores,
};

export default {
  name: 'ResumeContainer',
  components: {
    Icon,
    TextInput,
    PersonalInformation,
    ProfessionalSummary,
    Courses,
    Education,
    Employment,
    ExtraCurricular,
    Hobbies,
    Internships,
    Languages,
    References,
    Skills,
    SocialLinks,
    Custom,
    DefaultResumeTemplate,
    TestScores,
  },
  computed: {
    sections() {
      return this.$store.state.resume.sections.map(section => ({
        ...section,
        component: sectionsMap[section.name],
      }));
    },
    rules() {
      const data = Object.values(this.$store.getters.progessValue.rules).filter(
        ruleData => ruleData && ruleData.value
      );
      const result = data.length < 9 ? data : data.slice(0, 8);
      return result;
    },
    progressValue() {
      return this.$store.getters.progessValue.value;
    },
  },
  data() {
    return {
      resumeScale: 0,
      resumeHeight: 0,
      show_progress_rules: false,
    };
  },
  mounted() {
    this.$bus.$on('deleteSection', sectionId => {
      const result = window.confirm(
        'Are you sure you want to delete this section?'
      );
      if (result) this.$store.commit('REMOVE_SECTION', sectionId);
    });
    const container = this.$refs.previewMedium;
    const { width } = container.getBoundingClientRect();
    this.resumeScale = width / 900;
  },
  methods: {
    onPreview() {
      const node = document
        .querySelector('[data-type="resume-iframe"]')
        .contentDocument.cloneNode(true);
      let prtContent = node.all[0];
      let WinPrint = window.open(
        '',
        '',
        'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0'
      );
      let styles = prtContent.children[0].querySelector('style').innerHTML;
      const additionalStyles = `
        body{ 
        margin: 50px auto;
        box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.3)!important; 
        border-radius: 10px!important;
        }
      `;
      styles += additionalStyles;
      prtContent.children[0].innerHTML = `<style> ${styles} </style>`;
      WinPrint.document.write(prtContent.innerHTML);
    },
    onDownload() {
      var prtContent = document.querySelector('[data-type="resume-iframe"]')
        .contentDocument.all[0];
      var WinPrint = window.open(
        '',
        '',
        'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0'
      );
      WinPrint.document.write(prtContent.innerHTML);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    addSection(name) {
      this.$store.dispatch('AddSection', {name: name})
    },
    deleteSection(id) {
      this.$store.dispatch('DeleteSection', {id: id})
    },
    isAdded(sectionName) {
      return this.$store.state.resume.sections.find(
        sec => sec.name === sectionName
      );
    },
  },
};
