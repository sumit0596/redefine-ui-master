import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { event } from 'jquery';

/**
 * Node for to-do item
 */
export class TreeNode {
  children?: TreeNode[];
  item!: string;
  index!: number;
  datatype!: string;
  Id! : number
}

export class TreeFlatNode {
  item!: string;
  level!: number;
  datatype!: string;
  index!: number;
  expandable!: boolean;
  Id! : number
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable({ providedIn: 'root' })
export class ChecklistDatabase {

  dataChange = new BehaviorSubject<TreeNode[]>([]);
  treeData!: any[];
  areaList$!: Observable<any>;
  areaList!: any[];

  get data(): TreeNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  public setData(arealist:any) {
    this.areaList = arealist
  }
  
  initialize() {
    if(this.areaList){
        this.treeData = this.areaList;
        const data = this.areaList;
        this.dataChange.next(data);
    }
  }

  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      // Filter the tree
      function filter(array:any, text:any) {
        const getChildren = (result:any, object:any) => {
         // if (object.item.toLowerCase() === text.toLowerCase()) {
          if (object.item.toLowerCase().includes(text.toLowerCase())) {
            result.push(object);
            return result;
          }
          if (Array.isArray(object.children)) {
            const children = object.children.reduce(getChildren, []);
            if (children?.length) result.push({ ...object, children });
          }
          return result;
        };

        return array.reduce(getChildren, []);
      }

      filteredTreeData = filter(this.treeData, filterText);
    } else {
  
      filteredTreeData = this.treeData;
    }
    const data = filteredTreeData;
    // Notify the change.
    this.dataChange.next(data);
  }
}

@Component({
  selector: 'app-all-location-dropdown',
  templateUrl: './all-location-dropdown.component.html',
  styleUrls: ['./all-location-dropdown.component.scss'],
  standalone: true,
  imports: [CommonModule , RouterModule ,MatTreeModule, MatButtonModule, MatIconModule,RouterOutlet,MatAutocompleteModule,ReactiveFormsModule,MatCheckboxModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AllLocationDropdownComponent implements AfterViewInit,OnInit {
    
    @ViewChild('inputField', { static: false }) inputField!: ElementRef;
    @ViewChildren(MatAutocompleteTrigger)
  autoCompleteTriggers!: QueryList<MatAutocompleteTrigger>;
    @Input() selectedAreas : any;
    @Input() areaList : any;
    @Input() inputLabel : string = '';
    @Input() fieldRequired : boolean = true;
    @Output() newItemEvent = new EventEmitter<string>(); 
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
   flatNodeMap = new Map<TreeFlatNode, TreeNode>();

   /** Map from nested node to flattened node. This helps us to keep the same object for selection */
   nestedNodeMap = new Map<TreeNode, TreeFlatNode>();
 
   /** A selected parent node to be inserted */
   selectedParent: TreeFlatNode | null = null;
 
   /** The new item's name */
   newItemName = '';
 
   treeControl: FlatTreeControl<TreeFlatNode>;
 
   treeFlattener: MatTreeFlattener<TreeNode, TreeFlatNode>;
 
   dataSource: MatTreeFlatDataSource<TreeNode, TreeFlatNode>;
 
   /** The selection for checklist */
   checklistSelection = new SelectionModel<TreeFlatNode>(true /* multiple */);
 
  /// Filtering
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  selectedValues : any = [];
    
  hasItem : boolean = true;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete!: MatAutocompleteTrigger;
  constructor(
    private _database: ChecklistDatabase,
    private cdRef:ChangeDetectorRef
  ) {
    this.treeFlattener = new MatTreeFlattener(
       this.transformer,
       this.getLevel,
       this.isExpandable,
       this.getChildren
     );
     this.treeControl = new FlatTreeControl<TreeFlatNode>(
       this.getLevel,
       this.isExpandable
     );
     this.dataSource = new MatTreeFlatDataSource(
       this.treeControl,
       this.treeFlattener
     );
 
     _database.dataChange.subscribe((data) => {
       if(data?.length==0){
         this.hasItem = false;
       }else{
         this.dataSource.data = data;
         this.hasItem = true;
       }
     });
  }
   
  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }
  
  ngOnInit() {

    if(this.areaList?.length>0){
      this._database.setData(this.areaList);
      this._database.initialize();
    }
    if(this.selectedAreas?.length>0){
      this.treeControl.expandAll();
    }
    window.addEventListener('scroll', this.scrollEvent, true);
   }

   scrollEvent = (event: any): void => {
     this.autoComplete.updatePosition();
   }

   ngAfterViewInit() {
      if(this.selectedAreas?.length>0){
        let idArray = this.selectedAreas.map((x:any) => x.Id);
        for (let i = 0; i < this.treeControl.dataNodes?.length; i++) {
            if (idArray.includes(this.treeControl.dataNodes[i].index) && this.treeControl.dataNodes[i].level==2) {
              this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
            } 
        }
      }
   }
 
   getLevel = (node: TreeFlatNode) => node.level;
 
   isExpandable = (node: TreeFlatNode) => node.expandable;
 
   getChildren = (node: any): TreeNode[] => node.children;
 
   hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.expandable;
 
   hasNoContent = (_: number, _nodeData: TreeFlatNode) => _nodeData.item === '';
 
 
   transformer = (node: TreeNode, level: number) => {
     const existingNode = this.nestedNodeMap.get(node);
     const flatNode =
       existingNode && existingNode.item === node.item
         ? existingNode
         : new TreeFlatNode();
     flatNode.item = node.item;
     flatNode.level = level;
     flatNode.index = node.index;
     flatNode.Id = node.Id;
     flatNode.expandable = !!node.children;
     this.flatNodeMap.set(flatNode, node);
     this.nestedNodeMap.set(node, flatNode);
     return flatNode;
   };
 
   descendantsAllSelected(node: TreeFlatNode): boolean {
     const descendants = this.treeControl.getDescendants(node);
     const descAllSelected = descendants.every((child) =>
       this.checklistSelection.isSelected(child)
     );
     return descAllSelected;
   }
 
   descendantsPartiallySelected(node: TreeFlatNode): boolean {
     const descendants = this.treeControl.getDescendants(node);
     const result = descendants.some((child) =>
       this.checklistSelection.isSelected(child)
     );
     return result && !this.descendantsAllSelected(node);
   }
 
 
   todoItemSelectionToggle(node: TreeFlatNode): void {
     this.checklistSelection.toggle(node);
     const descendants = this.treeControl.getDescendants(node);
     this.checklistSelection.isSelected(node)
       ? this.checklistSelection.select(...descendants)
       : this.checklistSelection.deselect(...descendants);
 
   
     descendants.every((child) => this.checklistSelection.isSelected(child));
     this.checkAllParentsSelection(node);
   }
 
 
   todoLeafItemSelectionToggle(node: TreeFlatNode): void {
     this.checklistSelection.toggle(node);
     this.checkAllParentsSelection(node);
   }
 
 
   checkAllParentsSelection(node: TreeFlatNode): void {
     let parent: TreeFlatNode | null = this.getParentNode(node);
     while (parent) {
       this.checkRootNodeSelection(parent);
       parent = this.getParentNode(parent);
     }
   }
 
 
   checkRootNodeSelection(node: TreeFlatNode): void {

     const nodeSelected = this.checklistSelection.isSelected(node);
     const descendants = this.treeControl.getDescendants(node);
     const descAllSelected = descendants.every((child) =>
       this.checklistSelection.isSelected(child)
     );
     if (nodeSelected && !descAllSelected) {
       this.checklistSelection.deselect(node);
     } else if (!nodeSelected && descAllSelected) {
       this.checklistSelection.select(node);
     }
   }
 
  
   getParentNode(node: TreeFlatNode): TreeFlatNode | null {

      let kl:any = [];
      let Ids:any = [];
        
      this.checklistSelection.selected.map((s:any) => {
              if(s.level == 2){
                  Ids.push({
                    Id : s.index,
                    Name : s.item
                  });
                  kl.push(s.item);
              }
      });
      this.newItemEvent.emit(Ids);
      this.getSelectedItems();
      const currentLevel = this.getLevel(node);
 
      if (currentLevel < 1) {
        return null;
      }
  
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
  
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
  
        if (this.getLevel(currentNode) < currentLevel) {
          return currentNode;
        }
      }
      return null;
   }
 
   getSelectedItems()  {
      let kl:any = [];
          this.checklistSelection.selected.map((s:any) => {
              if(s.level == 2){
                  kl.push(s);
              }
        });
      
      this.selectedValues = kl;
   }
 
  
   onClosedEvent(filterText: any) {
      this._database.filter('');
      this.myControl.setValue('');
   }
   filterChanged(filterText: any) {
     this._database.filter(filterText.target.value);
     if (filterText.target.value) {
       this.treeControl.expandAll();
     }
   }

   deselectAll(){
      for (let i = 0; i < this.treeControl.dataNodes?.length; i++) {
          this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
      }
      this.selectedValues = [];
      let array : any = [];
      this.newItemEvent.emit(array);  
   }

   deselectItem(item : any,event:any){
    for (let i = 0; i < this.treeControl.dataNodes?.length; i++) {
      if(this.treeControl.dataNodes[i].index==item.index){
         this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
      }
    }
    this.selectedValues = this.selectedValues.filter((x:any) => x.index != item.index);
    let Ids:any = [];  
    this.selectedValues.map((s:any) => {
                Ids.push({
                    Id : s.index,
                    Name : s.item
                  });
              
    });
    this.newItemEvent.emit(Ids);
    this.closePanels(event)
   }

   focusInput() {
    this.inputField.nativeElement.focus();
   }

  closePanels(event:any) {
    event.stopPropagation();
    this.autoCompleteTriggers.forEach(trigger => {
      trigger.closePanel();
    });
  }

  openPanels(evt : any) {
    evt.stopPropagation();
    this.autoCompleteTriggers.forEach(trigger => {
      if (!trigger.panelOpen) {
        trigger.openPanel();
      }else{
        trigger.closePanel();
      }
    });
  }

}
